import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { api } from '../services/api';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [coursesRes, progressRes] = await Promise.all([
          api.get('/courses'),
          api.get('/progress', token),
        ]);
        if (!cancelled) {
          setCourses(coursesRes.courses);
          setProgress(progressRes.progress);
        }
      } catch (err) {
        console.error('Falha ao carregar dados do painel:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const completedCount = progress.filter((p) => p.completed).length;

  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="mb-1 font-display text-3xl text-ink">Bem-vindo, {user?.username}!</h2>
        <p className="mb-6 font-body text-sm text-ink/60">
          {completedCount} de {courses.length} cursos concluídos
        </p>

        {loading ? (
          <p className="font-body text-ink/60">Carregando cursos...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const courseProgress = progress.find((p) => p.course_id === course.id);
              return (
                <div key={course.id} className="surface rounded-lg p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-lg text-study-600">{course.title}</h3>
                    {courseProgress?.completed && (
                      <span className="rounded-full bg-study-100 px-2 py-0.5 text-xs text-study-700">
                        Concluído
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-ink/70">{course.description}</p>
                  <p className="mt-3 font-body text-xs text-ink/40">
                    {course.modules.length} módulo(s)
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
