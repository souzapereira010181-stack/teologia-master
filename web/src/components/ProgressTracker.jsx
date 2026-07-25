import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { generateCertificate } from '../utils/generateCertificate';

const ProgressTracker = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, progressRes] = await Promise.all([
        api.get('/courses'),
        api.get('/progress', token),
      ]);
      setCourses(coursesRes.courses);
      setProgress(progressRes.progress);
    } catch (err) {
      console.error('Falha ao carregar progresso:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsCompleted = async (course) => {
    const current = progress.find((p) => p.course_id === course.id);
    const nextCompleted = !current?.completed;

    await api.post(`/progress/${course.id}`, { completed: nextCompleted }, token);
    await loadData();

    if (nextCompleted) {
      generateCertificate(user, course);
    }
  };

  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="mb-4 font-display text-2xl text-ink">Progresso dos Cursos</h2>

        {loading ? (
          <p className="font-body text-sm text-ink/60">Carregando...</p>
        ) : (
          <div className="surface divide-y divide-study-100 rounded-lg">
            {courses.map((course) => {
              const courseProgress = progress.find((p) => p.course_id === course.id);
              return (
                <div key={course.id} className="flex items-center justify-between p-4">
                  <span className="font-body text-ink">{course.title}</span>
                  <button
                    onClick={() => markAsCompleted(course)}
                    className={`rounded px-3 py-1 font-body text-sm text-white ${
                      courseProgress?.completed
                        ? 'bg-study-400 hover:bg-study-500'
                        : 'bg-study-600 hover:bg-study-700'
                    }`}
                  >
                    {courseProgress?.completed ? 'Concluído ✓' : 'Concluir'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgressTracker;
