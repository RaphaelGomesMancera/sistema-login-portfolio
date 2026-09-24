// ==========================================================
// Sistema de Login — cadastro, autenticação e sessão
// Dados persistidos em localStorage, apenas para demonstração.
// ==========================================================

const USERS_KEY = 'auth_demo_users';
const SESSION_KEY = 'auth_demo_session';

// ---------- Camada de dados (localStorage) ----------

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Não foi possível salvar os usuários:', e);
  }
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

function setSession(email) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  } catch (e) {
    console.error('Não foi possível salvar a sessão:', e);
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Não foi possível limpar a sessão:', e);
  }
}

// ---------- Referências de elementos ----------

const authPanel = document.getElementById('authPanel');
const loginForm = document.getElementById('loginForm');
const cadastroForm = document.getElementById('cadastroForm');
const tabs = document.querySelectorAll('.tab');
const hint = document.getElementById('hint');

// ---------- Alternância entre abas (login / cadastro) ----------

function showTab(name) {
  tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  loginForm.classList.toggle('hidden', name !== 'login');
  cadastroForm.classList.toggle('hidden', name !== 'cadastro');

  hint.innerHTML =
    name === 'login'
      ? 'Ainda não tem conta? <button id="hintSwitch">Criar uma agora</button>'
      : 'Já tem conta? <button id="hintSwitch">Entrar</button>';

  document.getElementById('hintSwitch').onclick = () =>
    showTab(name === 'login' ? 'cadastro' : 'login');
}

tabs.forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));
document.getElementById('hintSwitch').onclick = () => showTab('cadastro');

// ---------- Mostrar / ocultar senha ----------

document.querySelectorAll('.toggle-eye').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.textContent = isHidden ? 'ocultar' : 'mostrar';
  });
});

// ---------- Medidor de força de senha ----------

function calcForca(senha) {
  let pontos = 0;
  if (senha.length >= 6) pontos++;
  if (senha.length >= 10) pontos++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha) && /[^A-Za-z0-9]/.test(senha)) pontos++;
  return pontos; // 0 a 4
}

const NIVEIS_FORCA = [
  { cor: 'var(--weak)', texto: 'Muito fraca' },
  { cor: 'var(--weak)', texto: 'Fraca' },
  { cor: 'var(--mid)', texto: 'Razoável' },
  { cor: 'var(--strong)', texto: 'Boa' },
  { cor: 'var(--strong)', texto: 'Forte' },
];

document.getElementById('cadSenha').addEventListener('input', function () {
  const bars = document.querySelectorAll('#strengthBars i');
  const label = document.getElementById('strengthLabel');

  if (!this.value) {
    bars.forEach((b) => (b.style.background = ''));
    label.innerHTML = '&nbsp;';
    return;
  }

  const nivel = calcForca(this.value);
  bars.forEach((b, i) => {
    b.style.background = i < nivel ? NIVEIS_FORCA[nivel].cor : '';
  });
  label.textContent = NIVEIS_FORCA[nivel].texto;
  label.style.color = NIVEIS_FORCA[nivel].cor;
});

// ---------- Cadastro ----------

cadastroForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim().toLowerCase();
  const senha = document.getElementById('cadSenha').value;
  const msg = document.getElementById('cadMsg');
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    msg.textContent = 'Este e-mail já está cadastrado.';
    msg.className = 'msg err';
    return;
  }

  users.push({ nome, email, senha });
  saveUsers(users);

  msg.textContent = 'Conta criada! Você já pode entrar.';
  msg.className = 'msg ok';
  cadastroForm.reset();
  setTimeout(() => showTab('login'), 900);
});

// ---------- Login ----------

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const senha = document.getElementById('loginSenha').value;
  const msg = document.getElementById('loginMsg');
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.senha === senha);

  if (!user) {
    msg.textContent = 'E-mail ou senha incorretos.';
    msg.className = 'msg err';
    return;
  }

  setSession(email);
  renderDashboard(user);
});

// ---------- Painel pós-login ----------

function renderDashboard(user) {
  authPanel.innerHTML = `
    <div class="dash">
      <h2>Olá, ${user.nome.split(' ')[0]}</h2>
      <p>Você está autenticado como <strong>${user.email}</strong>.</p>
      <button id="logoutBtn">Sair da conta</button>
    </div>`;

  document.getElementById('logoutBtn').onclick = function () {
    clearSession();
    location.reload();
  };
}

// ---------- Inicialização: retoma sessão ativa, se houver ----------

const sessaoAtiva = getSession();
if (sessaoAtiva) {
  const user = getUsers().find((u) => u.email === sessaoAtiva.email);
  if (user) renderDashboard(user);
}
