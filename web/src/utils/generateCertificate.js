import { jsPDF } from 'jspdf';

export const generateCertificate = (user, course) => {
  const pdf = new jsPDF({ orientation: 'landscape' });

  pdf.setFontSize(28);
  pdf.text('Certificado de Conclusão', 148, 50, { align: 'center' });

  pdf.setFontSize(16);
  pdf.text(`Certificamos que ${user.username}`, 148, 80, { align: 'center' });
  pdf.text(`concluiu com êxito o curso:`, 148, 92, { align: 'center' });

  pdf.setFontSize(20);
  pdf.text(course.title, 148, 110, { align: 'center' });

  pdf.setFontSize(11);
  pdf.text(`Teologia Master — ${new Date().toLocaleDateString('pt-BR')}`, 148, 140, { align: 'center' });

  pdf.save(`certificado_${course.id}.pdf`);
};
