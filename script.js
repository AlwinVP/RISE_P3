const form = document.getElementById('resumeForm');
const output = document.getElementById('resumeOutput');
let uploadedImageDataUrl = '';

form.addEventListener('input', updatePreview);
document.getElementById('photo').addEventListener('change', handleImageUpload);

function addExperience() {
  const container = document.getElementById('experienceContainer');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Job Title @ Company';
  input.className = 'experience';
  container.appendChild(input);
  updatePreview();
}

function addProject() {
  const container = document.getElementById('projectsContainer');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Project Name';
  input.className = 'project';
  container.appendChild(input);
  updatePreview();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImageDataUrl = e.target.result;
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
}

function updatePreview() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const edu10 = document.getElementById('edu10').value.trim();
  const edu12 = document.getElementById('edu12').value.trim();
  const eduDegree = document.getElementById('eduDegree').value.trim();
  const hobbies = document.getElementById('hobbies').value.trim();

  const experiences = Array.from(document.getElementsByClassName('experience')).map(exp => exp.value.trim()).filter(e => e);
  const projects = Array.from(document.getElementsByClassName('project')).map(proj => proj.value.trim()).filter(p => p);

  output.innerHTML = `
    ${uploadedImageDataUrl ? `<img src="${uploadedImageDataUrl}" alt="Profile Picture" />` : ''}
    <h3>${name || 'Your Name'}</h3>
    <p>Email: ${email || 'you@example.com'}</p>
    <p>Phone: ${phone || '000-000-0000'}</p>

    <h4>Education</h4>
    <p>10th: ${edu10 || '-'}</p>
    <p>12th: ${edu12 || '-'}</p>
    <p>Degree: ${eduDegree || '-'}</p>

    <h4>Experience</h4>
    <ul>${experiences.map(e => `<li>${e}</li>`).join('')}</ul>

    <h4>Projects</h4>
    <ul>${projects.map(p => `<li>${p}</li>`).join('')}</ul>

    <h4>Hobbies</h4>
    <p>${hobbies || '-'}</p>
  `;
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  if (uploadedImageDataUrl) {
    const img = new Image();
    img.src = uploadedImageDataUrl;
    await new Promise(resolve => {
      img.onload = () => {
        doc.addImage(img, 'JPEG', 150, 10, 40, 40);
        resolve();
      };
    });
  }

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const edu10 = document.getElementById('edu10').value;
  const edu12 = document.getElementById('edu12').value;
  const eduDegree = document.getElementById('eduDegree').value;
  const hobbies = document.getElementById('hobbies').value;

  const experiences = Array.from(document.getElementsByClassName('experience')).map(e => e.value).filter(e => e);
  const projects = Array.from(document.getElementsByClassName('project')).map(p => p.value).filter(p => p);

  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text(`${name}`, 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`${email}`, 10, y);
  y += 7;
  doc.text(`${phone}`, 10, y);
  y += 10;
  doc.line(10, y, 200, y);
  y += 5;

  doc.text('Education:', 10, y);
  y += 7;
  doc.text(`10th: ${edu10}`, 10, y);
  y += 7;
  doc.text(`12th: ${edu12}`, 10, y);
  y += 7;
  doc.text(`Degree: ${eduDegree}`, 10, y);
  y += 10;
  doc.line(10, y, 200, y);
  y += 5;

  doc.text('Experience:', 10, y);
  experiences.forEach(exp => {
    y += 7;
    doc.text(`- ${exp}`, 12, y);
  });
  y += 7;
  doc.line(10, y, 200, y);
  y += 5;

  doc.text('Projects:', 10, y);
  projects.forEach(proj => {
    y += 7;
    doc.text(`${proj}`, 12, y);
  });
  y += 7;
  doc.line(10, y, 200, y);
  y += 5;

  doc.text('Hobbies:', 10, y);
  y += 7;
  doc.text(hobbies, 12, y, { maxWidth: 180 });

  doc.save(`${name}-resume.pdf`);
}
