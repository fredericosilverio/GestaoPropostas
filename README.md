
Este sistema foi desenvolvido para a Administração Pública (Estado de Goiás) com o objetivo de gerenciar o **Plano de Contratações Anual (PCA)** e realizar **análises de mercado** para estimativa de preços em processos licitatórios, garantindo conformidade com o **Decreto Estadual nº 9.900/2021**.

## 🚀 Funcionalidades Principais

- **Gestão do PCA:** Cadastro, acompanhamento e execução do Plano de Contratações Anual.
- **Gestão de Demandas:** Controle total do ciclo de vida das demandas de contratação.
- **Análise de Mercado Automatizada:** Cálculos automáticos de média, mediana e intervalo de ±25% conforme legislação.
- **Auditoria Completa:** Histórico imutável de todas as ações realizadas no sistema.
- **Relatórios:** Geração de relatórios profissionais em PDF e Excel para instrução processual.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**
- **Prisma ORM** para persistência de dados
- **SQLite** como banco de dados (local e ágil)
- **TypeScript** para maior segurança no código

### Frontend
- **React** (v19) com **Vite**
- **Material UI (MUI)** para interface rica e moderna
- **React Router** para navegação
- **Data Grid & Charts** para visualização de dados complexos

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js (v18 ou superior)
- NPM (v9 ou superior)

### 1. Clonar e Instalar Backend (Server)
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 2. Instalar Frontend (Client)
```bash
cd client
npm install
```

## 🏃 Como Executar

Você pode iniciar o projeto de duas formas:

### Forma Rápida (Windows)
Execute o arquivo na raiz do projeto:
```cmd
start_app.bat
```

### Forma Manual
Inicie o servidor e o cliente em terminais separados:

**Servidor (Porta 3333):**
```bash
cd server
npm run dev
```

**Cliente (Porta 5173):**
```bash
cd client
npm run dev
```

### 🐳 Instalação com Docker (Recomendado)
O sistema está preparado para rodar em containers, o que facilita o deploy e garante que o ambiente seja idêntico para todos.

**Pré-requisitos:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e configurado.

**Como rodar:**
1. Abra o terminal na raiz do projeto.
2. Execute o comando:
   ```bash
   docker-compose up --build -d
   ```
3. O sistema estará disponível em:
    - **Frontend:** [http://localhost](http://localhost) (Porta 80)
    - **Backend API:** [http://localhost:3333](http://localhost:3333)

> [!IMPORTANT]
> Sempre que realizar alterações no código ou nas configurações (como as recentes atualizações de conformidade com o Art. 6º), é necessário reconstruir as imagens para que as mudanças tenham efeito no ambiente Docker:
> ```bash
> docker-compose down
> docker-compose up --build -d
> ```

**Notas importantes:**
- O banco de dados SQLite e os arquivos de upload são persistidos através de volumes do Docker.
- O frontend em Docker utiliza **Nginx** para alta performance.



## ⚖️ Conformidade Legal
O sistema implementa rigorosamente a metodologia do **Decreto Estadual nº 9.900/2021 (Art. 6º)**, utilizando a mediana dos valores obtidos e fixando o intervalo de variação de 25% para validação de preços.

## 📁 Estrutura do Projeto
- `/server`: API Backend, lógica de negócio e banco de dados.
- `/client`: Interface Web React e componentes visuais.
- `/docs` (ou PRDs na raiz): Documentação técnica e de requisitos completa.

