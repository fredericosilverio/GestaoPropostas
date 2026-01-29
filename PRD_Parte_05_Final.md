# PRD – Sistema de Análise de Mercado para Licitações Públicas
## PARTE 5 - Testes, Segurança, Cronograma e Roadmap (FINAL)

**Versão:** 2.0  
**Data:** Janeiro de 2026

---

## Índice da Parte 5

12. [Requisitos Não Funcionais Completos](#12-requisitos-não-funcionais-completos)
13. [Estratégia de Testes](#13-estratégia-de-testes)
14. [Segurança e Conformidade](#14-segurança-e-conformidade)
15. [Cronograma e Fases](#15-cronograma-e-fases)
16. [Riscos e Mitigações](#16-riscos-e-mitigações)
17. [Métricas de Sucesso e KPIs](#17-métricas-de-sucesso-e-kpis)
18. [Roadmap Futuro](#18-roadmap-futuro)
19. [Glossário](#19-glossário)
20. [Anexos](#20-anexos)

---

## 12. Requisitos Não Funcionais Completos

### 12.1 Performance

**RNF-001: Tempo de Resposta**

| Operação | Meta | Crítico |
|----------|------|---------|
| Login | < 2s | < 5s |
| Carregar dashboard | < 3s | < 5s |
| Carregar lista de demandas (50 itens) | < 2s | < 4s |
| Salvar demanda | < 1s | < 3s |
| Calcular estatísticas (até 100 preços) | < 500ms | < 2s |
| Gerar relatório PDF (até 50 páginas) | < 10s | < 30s |
| Busca global | < 1s | < 3s |
| Upload de arquivo (5MB) | < 5s | < 15s |

**Testes de Performance:**
- Usar ferramentas: JMeter, LoadRunner ou k6
- Simular 100 usuários simultâneos
- Testes de carga: 150% da capacidade esperada
- Testes de estresse: até ponto de falha

**RNF-002: Throughput**

- Mínimo: 50 requisições/segundo
- Desejável: 100 requisições/segundo
- Pico: suportar 200 requisições/segundo por 10 minutos

**RNF-003: Capacidade**

| Recurso | Capacidade Mínima |
|---------|-------------------|
| Usuários simultâneos | 100 |
| PCAs ativos | 50 |
| Demandas/ano | 10.000 |
| Itens/demanda | 200 |
| Preços/item | 100 |
| Anexos/entidade | 10 |
| Tamanho BD | 500 GB (escalável) |

**RNF-004: Escalabilidade**

- Arquitetura deve permitir escalabilidade horizontal
- Banco de dados com replicação (read replicas)
- Cache distribuído (Redis/Memcached)
- CDN para arquivos estáticos
- Load balancer para distribuição de carga

---

### 12.2 Disponibilidade e Confiabilidade

**RNF-005: Uptime (SLA)**

- **Disponibilidade mínima:** 99.0% (downtime de ~7,2h/mês)
- **Disponibilidade desejável:** 99.5% (downtime de ~3,6h/mês)
- **Disponibilidade ideal:** 99.9% (downtime de ~43min/mês)

**Horário Crítico:**
- Segunda a sexta: 08h - 18h
- Maior criticidade: 09h - 17h

**Janela de Manutenção:**
- Sábados: 22h - 06h (domingo)
- Máximo 4 horas de downtime
- Notificação com 48h de antecedência

**RNF-006: Recuperação de Desastres**

| Métrica | Meta |
|---------|------|
| RTO (Recovery Time Objective) | 4 horas |
| RPO (Recovery Point Objective) | 24 horas |
| MTTR (Mean Time To Repair) | 2 horas |
| MTBF (Mean Time Between Failures) | 720 horas (30 dias) |

**Plano de Continuidade:**
- Backup automático diário (incremental)
- Backup completo semanal
- Storage secundário (offsite)
- Procedimento de recuperação documentado
- Testes de recuperação trimestrais

**RNF-007: Tolerância a Falhas**

- Sistema deve degradar gracefully (funcionalidade reduzida vs parada total)
- Transações devem ser atômicas (ACID)
- Retry automático para operações transientes
- Circuit breaker para serviços externos
- Mensagens de erro amigáveis

---

### 12.3 Segurança

**RNF-008: Autenticação**

- Suporte a múltiplos métodos:
  - Active Directory (LDAP) - preferencial
  - OAuth 2.0 / OpenID Connect
  - Autenticação local (fallback)
- Senha forte obrigatória (se autenticação local):
  - Mínimo 8 caracteres
  - Letras maiúsculas e minúsculas
  - Números
  - Caracteres especiais
- Bloqueio após 5 tentativas falhas (30 minutos)
- Logout automático após 30 minutos de inatividade
- Logout forçado às 00h

**RNF-009: Autorização**

- Controle de acesso baseado em perfis (RBAC)
- Segregação de funções
- Princípio do menor privilégio
- Auditoria de acessos não autorizados

**RNF-010: Criptografia**

| Camada | Protocolo/Algoritmo |
|--------|---------------------|
| Em trânsito | TLS 1.2+ (HTTPS obrigatório) |
| Em repouso (dados sensíveis) | AES-256 |
| Senhas | bcrypt (cost factor ≥ 10) |
| Tokens | JWT com RS256 |
| Backups | AES-256 |

**RNF-011: Proteções de Segurança**

- ✅ SQL Injection: prepared statements, ORM
- ✅ XSS: sanitização de inputs, CSP headers
- ✅ CSRF: tokens, SameSite cookies
- ✅ Clickjacking: X-Frame-Options
- ✅ MIME Sniffing: X-Content-Type-Options
- ✅ Session Fixation: regenerar session ID no login
- ✅ Brute Force: rate limiting, CAPTCHA
- ✅ File Upload: validação de tipo, antivírus

**RNF-012: Headers de Segurança**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: no-referrer-when-downgrade
```

**RNF-013: Auditoria de Segurança**

- Testes de penetração semestrais
- Análise de vulnerabilidades mensais
- OWASP Top 10 compliance
- Code review focado em segurança
- Monitoramento de CVEs de dependências

---

### 12.4 Usabilidade e Acessibilidade

**RNF-014: Navegadores Suportados**

| Navegador | Versões |
|-----------|---------|
| Google Chrome | Últimas 2 versões |
| Mozilla Firefox | Últimas 2 versões |
| Microsoft Edge | Últimas 2 versões |
| Safari | Última versão (melhor esforço) |

**Não suportado:**
- Internet Explorer (qualquer versão)
- Navegadores mobile (inicialmente)

**RNF-015: Resoluções de Tela**

| Dispositivo | Resolução | Suporte |
|-------------|-----------|---------|
| Desktop | 1920x1080 | Otimizado |
| Notebook | 1366x768 | Otimizado |
| Tablet landscape | 1024x768 | Funcional |
| Mobile | < 768px | Não suportado (fase 1) |

**RNF-016: Acessibilidade (WCAG 2.1 Nível AA)**

- ✅ Navegação por teclado (Tab, Shift+Tab)
- ✅ Compatibilidade com leitores de tela (NVDA, JAWS)
- ✅ Contraste de cores ≥ 4.5:1
- ✅ Textos alternativos em imagens
- ✅ Labels em campos de formulário
- ✅ Foco visível
- ✅ Landmarks ARIA
- ✅ Tamanho de fonte ajustável
- ✅ Sem dependência de cor apenas
- ✅ Conteúdo piscante controlável

**RNF-017: Usabilidade**

- Formulários com validação em tempo real
- Mensagens de erro claras e acionáveis
- Confirmação antes de ações destrutivas
- Breadcrumbs para navegação
- Atalhos de teclado para ações frequentes
- Help contextual (tooltips, links para help)
- Busca global com autocomplete
- Feedback visual de carregamento
- Desfazer para ações críticas

**RNF-018: Internacionalização (i18n)**

- Sistema em Português do Brasil (pt-BR)
- Números: formato brasileiro (1.234,56)
- Datas: formato brasileiro (dd/mm/yyyy)
- Moeda: Real (R$)
- Fuso horário: Brasília (UTC-3)

---

### 12.5 Manutenibilidade

**RNF-019: Código**

- Código versionado em Git
- Branching strategy: GitFlow ou GitHub Flow
- Code review obrigatório (pelo menos 1 aprovação)
- Cobertura de testes mínima: 70%
- Documentação inline (comentários em código complexo)
- Naming conventions consistentes
- Linting automático (ESLint, Pylint, etc.)
- Formatação automática (Prettier, Black, etc.)

**RNF-020: Documentação**

Documentação obrigatória:
- README com instruções de setup
- Guia de contribuição
- Arquitetura do sistema (diagramas)
- Documentação de API (Swagger/OpenAPI)
- Manual do usuário
- Manual do administrador
- Vídeos tutoriais (mínimo 5)
- FAQ
- Troubleshooting guide

**RNF-021: Logs**

- Logs estruturados (JSON)
- Níveis: DEBUG, INFO, WARN, ERROR, FATAL
- Rotação automática diária
- Retenção: 90 dias em disco, 1 ano em archive
- Centralização de logs (ex: ELK Stack, Splunk)
- Monitoramento de erros (ex: Sentry)
- Alertas para erros críticos

**RNF-022: Monitoramento**

Métricas a monitorar:
- Uptime/Downtime
- Tempo de resposta (p50, p95, p99)
- Taxa de erro (4xx, 5xx)
- Uso de CPU, memória, disco
- Conexões de banco de dados
- Tamanho de filas
- Taxa de requisições/segundo
- Sessões ativas

Ferramentas sugeridas:
- Prometheus + Grafana
- New Relic / Datadog
- AWS CloudWatch (se cloud)

---

### 12.6 Compatibilidade e Portabilidade

**RNF-023: Tecnologias**

**Backend (sugestões):**
- Linguagem: Python 3.9+, Node.js 16+, ou Java 11+
- Framework: Django/Flask, Express, ou Spring Boot
- ORM: SQLAlchemy, Sequelize, ou Hibernate
- API: REST (JSON)

**Frontend (sugestões):**
- Framework: React 18+, Vue 3+, ou Angular 14+
- Linguagem: TypeScript
- Build: Webpack, Vite, ou Create React App
- Estilização: Tailwind CSS, Bootstrap 5, ou Material-UI

**Banco de Dados:**
- Preferencial: PostgreSQL 12+
- Alternativa: MySQL 8.0+
- Não usar: SQLite (não escala)

**RNF-024: Infraestrutura**

**Opções:**
1. **On-premise:**
   - Servidor Linux (Ubuntu 20.04 LTS ou superior)
   - Mínimo: 4 vCPUs, 8GB RAM, 500GB SSD
   - Recomendado: 8 vCPUs, 16GB RAM, 1TB SSD

2. **Cloud:**
   - AWS: EC2, RDS, S3, CloudFront
   - Azure: VMs, Azure SQL, Blob Storage
   - GCP: Compute Engine, Cloud SQL, Cloud Storage

**RNF-025: Deploy**

- CI/CD automatizado (Jenkins, GitLab CI, GitHub Actions)
- Containerização (Docker)
- Orquestração (Kubernetes ou Docker Compose)
- Blue-green deployment ou canary releases
- Rollback automático em caso de falha

---

## 13. Estratégia de Testes

### 13.1 Pirâmide de Testes

```
         /\
        /  \    Testes E2E (10%)
       /____\   
      /      \  
     / Testes \  Testes de Integração (20%)
    /   de Int.\
   /____________\
  /              \
 /   Testes      \ Testes Unitários (70%)
/    Unitários    \
/__________________\
```

### 13.2 Tipos de Testes

#### 13.2.1 Testes Unitários

**Objetivo:** Testar componentes isolados

**Cobertura mínima:** 70%

**Ferramentas:**
- Python: pytest
- JavaScript: Jest, Mocha
- Java: JUnit

**Exemplos de testes:**
```python
# Teste de cálculo de mediana
def test_calcula_mediana_impar():
    precos = [18.00, 18.50, 19.00]
    assert calcula_mediana(precos) == 18.50

def test_calcula_mediana_par():
    precos = [18.00, 18.50, 19.00, 25.00]
    assert calcula_mediana(precos) == 18.75

# Teste de validação de CNPJ
def test_valida_cnpj_valido():
    assert valida_cnpj("12.345.678/0001-99") == True

def test_valida_cnpj_invalido():
    assert valida_cnpj("00.000.000/0000-00") == False
```

#### 13.2.2 Testes de Integração

**Objetivo:** Testar interação entre componentes

**Exemplos:**
- API + Banco de Dados
- Upload de arquivo + Storage
- Envio de e-mail + Servidor SMTP
- Autenticação + Active Directory

**Ferramentas:**
- Postman / Newman
- REST Assured
- Supertest

#### 13.2.3 Testes E2E (End-to-End)

**Objetivo:** Testar fluxos completos do usuário

**Ferramentas:**
- Selenium
- Cypress
- Playwright

**Casos de teste prioritários:**
1. Login → Criar demanda → Adicionar item → Cadastrar 3 preços → Gerar relatório
2. Login → Dashboard → Filtrar demandas → Exportar lista
3. Login (Gestor) → Aprovar demanda → Iniciar contratação
4. Login → Busca global → Visualizar resultado
5. Login → Editar demanda → Salvar → Verificar histórico

#### 13.2.4 Testes de Performance

**Objetivo:** Validar requisitos de performance

**Tipos:**
- **Load Testing:** comportamento sob carga normal
- **Stress Testing:** comportamento sob carga extrema
- **Spike Testing:** comportamento com picos súbitos
- **Endurance Testing:** estabilidade por período prolongado

**Ferramentas:**
- Apache JMeter
- k6
- Gatling
- LoadRunner

**Cenários:**
```
Cenário 1: Carga Normal
- 50 usuários simultâneos
- Duração: 30 minutos
- Ramp-up: 5 minutos
- Ações: login, navegar, criar demanda, buscar

Cenário 2: Carga Pico
- 150 usuários simultâneos
- Duração: 10 minutos
- Ramp-up: 2 minutos

Cenário 3: Estresse
- Incrementar usuários de 10 em 10
- Até sistema apresentar erro
- Identificar limite de capacidade
```

#### 13.2.5 Testes de Segurança

**Objetivo:** Identificar vulnerabilidades

**Tipos:**
- **SAST (Static):** análise de código fonte
- **DAST (Dynamic):** análise em runtime
- **Penetration Testing:** simulação de ataque

**Ferramentas:**
- OWASP ZAP
- Burp Suite
- SonarQube (SAST)
- Snyk (dependências)

**Checklist:**
- ✅ SQL Injection
- ✅ XSS (Reflected e Stored)
- ✅ CSRF
- ✅ Authentication bypass
- ✅ Authorization bypass
- ✅ Session hijacking
- ✅ File upload vulnerabilities
- ✅ Information disclosure
- ✅ Broken access control
- ✅ Security misconfiguration

#### 13.2.6 Testes de Usabilidade

**Objetivo:** Validar experiência do usuário

**Métodos:**
- Testes com usuários reais (5-8 pessoas)
- Task analysis (concluir tarefa específica)
- Thinking aloud (verbalizar pensamentos)
- Questionários pós-teste (SUS, NPS)

**Tarefas típicas:**
1. Cadastrar uma nova demanda
2. Adicionar um item com 3 preços
3. Gerar relatório de análise de mercado
4. Encontrar demanda específica usando busca
5. Exportar lista de demandas em Excel

**Métricas:**
- Taxa de conclusão da tarefa
- Tempo para completar tarefa
- Número de erros
- SUS Score (System Usability Scale)
- NPS (Net Promoter Score)

#### 13.2.7 Testes de Acessibilidade

**Objetivo:** Validar conformidade WCAG 2.1 AA

**Ferramentas:**
- axe DevTools
- WAVE
- Lighthouse (Chrome)
- Screen readers (NVDA, JAWS)

**Checklist:**
- ✅ Navegação por teclado completa
- ✅ Foco visível
- ✅ Contraste de cores adequado
- ✅ Textos alternativos
- ✅ Labels em formulários
- ✅ ARIA landmarks
- ✅ Compatibilidade com leitores de tela
- ✅ Sem timeout forçado
- ✅ Conteúdo piscante controlável

### 13.3 Plano de Testes

**Fase 1: Desenvolvimento**
- Testes unitários contínuos (CI)
- Code review com foco em testes
- Cobertura de código monitorada

**Fase 2: Integração**
- Testes de integração automatizados
- Testes de API (Postman collections)
- Deploy em ambiente de QA

**Fase 3: QA (Quality Assurance)**
- Testes E2E automatizados
- Testes manuais exploratórios
- Testes de regressão
- Testes de performance
- Testes de segurança (OWASP ZAP)

**Fase 4: UAT (User Acceptance Testing)**
- Testes com usuários reais
- Validação de requisitos funcionais
- Testes de usabilidade
- Feedback collection

**Fase 5: Pré-Produção**
- Smoke tests
- Testes de carga em ambiente similar a produção
- Teste de backup e recuperação
- Validação de monitoramento

### 13.4 Critérios de Aceitação de Testes

**Para avançar para UAT:**
- ✅ 100% dos testes unitários passando
- ✅ 100% dos testes de integração passando
- ✅ 95% dos testes E2E passando
- ✅ Cobertura de código ≥ 70%
- ✅ 0 bugs críticos
- ✅ ≤ 5 bugs médios
- ✅ Requisitos de performance atendidos

**Para ir para produção:**
- ✅ UAT concluído com sucesso
- ✅ Todos os bugs críticos resolvidos
- ✅ 90% dos bugs médios resolvidos
- ✅ Testes de segurança sem vulnerabilidades críticas
- ✅ Testes de acessibilidade conformes
- ✅ Aprovação do Product Owner
- ✅ Aprovação da área jurídica
- ✅ Documentação completa
- ✅ Treinamento realizado

---

## 14. Segurança e Conformidade

### 14.1 LGPD (Lei Geral de Proteção de Dados)

**Dados Pessoais Tratados:**

| Dado | Finalidade | Base Legal | Retenção |
|------|------------|------------|----------|
| Nome completo | Identificação do usuário | Execução de contrato | Enquanto ativo + 5 anos |
| CPF | Identificação única | Execução de contrato | Enquanto ativo + 5 anos |
| E-mail | Comunicação | Execução de contrato | Enquanto ativo + 5 anos |
| Matrícula | Vínculo institucional | Execução de contrato | Enquanto ativo + 5 anos |
| Telefone | Contato (opcional) | Consentimento | Enquanto ativo + 1 ano |
| IP de acesso | Segurança e auditoria | Legítimo interesse | 6 meses |
| Logs de auditoria | Conformidade legal | Obrigação legal | 5 anos |

**Direitos dos Titulares:**

Implementar funcionalidades para:
- ✅ **Acesso:** usuário pode baixar seus dados (JSON/PDF)
- ✅ **Correção:** usuário pode corrigir dados cadastrais
- ✅ **Exclusão:** usuário pode solicitar exclusão (após desligamento)
- ✅ **Portabilidade:** exportar dados em formato estruturado
- ✅ **Revogação:** revogar consentimentos (ex: receber e-mails)
- ✅ **Informação:** política de privacidade clara e acessível

**Medidas de Segurança:**
- Criptografia de dados sensíveis
- Acesso restrito por perfil
- Logs de acesso a dados pessoais
- Anonimização de dados em relatórios estatísticos
- DPO (Data Protection Officer) designado

**Relatórios LGPD:**
- Relatório de dados pessoais tratados
- Relatório de bases legais
- Registro de incidentes de segurança
- Relatório de exercício de direitos

### 14.2 Auditoria e Controle Interno

**Trilha de Auditoria:**

Registrar OBRIGATORIAMENTE:
- Login e logout
- Criação, edição e exclusão de dados
- Mudanças de status
- Aprovações e rejeições
- Ajustes manuais de valores
- Exportação de dados
- Alteração de configurações
- Gestão de usuários
- Tentativas de acesso não autorizado

**Formato do Log:**
```json
{
  "id": 12345,
  "timestamp": "2026-01-20T14:22:18.000Z",
  "usuario_id": 67890,
  "usuario_nome": "Maria Santos",
  "usuario_perfil": "gestor",
  "acao": "UPDATE",
  "entidade_tipo": "demanda",
  "entidade_id": 244,
  "campo_alterado": "valor_estimado",
  "valor_anterior": "18500.00",
  "valor_novo": "19000.00",
  "justificativa": "Ajuste devido a variação cambial...",
  "ip": "192.168.1.50",
  "user_agent": "Mozilla/5.0...",
  "resultado": "sucesso"
}
```

**Relatórios de Auditoria:**
- Por período
- Por usuário
- Por tipo de ação
- Por entidade
- Comparação antes/depois (diff)

### 14.3 Políticas de Segurança

**Política de Senhas:**
- Mínimo 8 caracteres
- Complexidade obrigatória
- Histórico de 5 senhas (não reutilizar)
- Expiração a cada 90 dias
- Bloqueio após 5 tentativas falhas

**Política de Acesso:**
- Princípio do menor privilégio
- Revisão trimestral de acessos
- Desativação imediata de usuários desligados
- Acesso temporário para auditores externos

**Política de Backup:**
- Backup diário incremental
- Backup semanal completo
- Retenção: 7 diários, 4 semanais, 12 mensais
- Teste de restauração trimestral
- Criptografia AES-256

**Política de Logs:**
- Logs são imutáveis
- Retenção mínima: 5 anos
- Backup automático
- Acesso restrito (Admin e Auditor)

---

## 15. Cronograma e Fases

### 15.1 Roadmap de Implementação

**Fase 1: MVP (Minimum Viable Product) - 3 meses**

**Objetivo:** Sistema funcional com requisitos essenciais

**Entregas:**
- ✅ Autenticação e gestão de usuários
- ✅ Cadastro de PCA
- ✅ Cadastro de demandas
- ✅ Cadastro de itens
- ✅ Registro de preços
- ✅ Cálculos estatísticos automáticos
- ✅ Validação e classificação de preços
- ✅ Relatório básico de análise de mercado (PDF)
- ✅ Log de auditoria básico

**Não inclui:**
- Dashboard complexo
- Versionamento de PCA
- Aprovação de exceções
- Integração com AD
- Relatórios avançados

**Cronograma MVP:**

```
Mês 1: Setup e Backend Core
├─ Semana 1: Setup do projeto, definição de arquitetura
├─ Semana 2: Banco de dados, autenticação básica
├─ Semana 3: API de usuários, PCA, demandas
└─ Semana 4: API de itens e preços

Mês 2: Cálculos e Relatórios
├─ Semana 5: Lógica de cálculos estatísticos
├─ Semana 6: Validação e classificação de preços
├─ Semana 7: Geração de relatório em PDF
└─ Semana 8: Log de auditoria

Mês 3: Frontend e Testes
├─ Semana 9: Interface de login e gestão de usuários
├─ Semana 10: Telas de cadastro (PCA, demanda, item)
├─ Semana 11: Tela de preços e visualização de análise
└─ Semana 12: Testes, ajustes, deploy em QA
```

---

**Fase 2: Versão Completa - 3 meses adicionais**

**Objetivo:** Adicionar funcionalidades avançadas e melhorias

**Entregas:**
- ✅ Dashboard interativo
- ✅ Versionamento de PCA
- ✅ Fluxo de aprovação de exceções
- ✅ Integração com Active Directory
- ✅ Catálogo reutilizável de itens
- ✅ Histórico de preços
- ✅ Notificações por e-mail
- ✅ Comentários e colaboração
- ✅ Relatórios avançados (PCA, auditoria)
- ✅ Importação em lote (CSV/XLSX)
- ✅ Exportação em múltiplos formatos

**Cronograma Fase 2:**

```
Mês 4: Features Avançadas
├─ Semana 13: Dashboard com gráficos
├─ Semana 14: Versionamento de PCA
├─ Semana 15: Fluxo de aprovação de exceções
└─ Semana 16: Integração com AD

Mês 5: Melhorias e Relatórios
├─ Semana 17: Catálogo e histórico de preços
├─ Semana 18: Sistema de notificações
├─ Semana 19: Comentários e colaboração
└─ Semana 20: Relatórios avançados

Mês 6: Polimento e Go-Live
├─ Semana 21: Importação/exportação em lote
├─ Semana 22: Testes completos (E2E, performance, segurança)
├─ Semana 23: UAT com usuários reais, ajustes
└─ Semana 24: Treinamento, documentação, go-live
```

---

**Fase 3: Evoluções Futuras - Roadmap 12 meses**

Priorizado conforme feedback e necessidades:

**Q1 2027 (Jan-Mar):**
- Parametrização do percentual de intervalo (não fixo em 25%)
- App mobile (visualização)
- Modo offline (Progressive Web App)

**Q2 2027 (Abr-Jun):**
- Integração com ComprasNet (busca de preços)
- Integração com Banco de Preços (estadual)
- API pública para terceiros

**Q3 2027 (Jul-Set):**
- Geração automática de textos (ETP, TR) com IA
- Sugestões inteligentes de itens similares
- Análise preditiva de preços

**Q4 2027 (Out-Dez):**
- Portal do fornecedor (cotação online)
- Módulo de pregão eletrônico
- Assinatura digital integrada (ICP-Brasil)

### 15.2 Marcos (Milestones)

| Marco | Data | Descrição |
|-------|------|-----------|
| M1 - Kickoff | 01/02/2026 | Início do projeto |
| M2 - Backend MVP | 01/03/2026 | APIs essenciais prontas |
| M3 - Frontend MVP | 01/04/2026 | Interface básica funcional |
| M4 - MVP em QA | 15/04/2026 | MVP em ambiente de testes |
| M5 - MVP Go-Live | 01/05/2026 | MVP em produção (piloto) |
| M6 - Features Avançadas | 01/06/2026 | Dashboard, versionamento, etc. |
| M7 - UAT Completo | 15/07/2026 | Testes com usuários |
| M8 - Versão 2.0 Go-Live | 01/08/2026 | Versão completa em produção |

### 15.3 Equipe Necessária

**Time Core:**
- 1 Product Owner (tempo parcial 50%)
- 1 Scrum Master / Project Manager
- 2-3 Desenvolvedores Backend
- 2 Desenvolvedores Frontend
- 1 QA / Tester
- 1 UX/UI Designer (tempo parcial)
- 1 DevOps Engineer (tempo parcial)

**Apoio:**
- Especialista em segurança (consultoria)
- DBA (consultoria)
- Área jurídica (validação)
- Usuários para UAT (5-8 pessoas)

**Total:** 8-10 pessoas (tempo integral e parcial)

---

## 16. Riscos e Mitigações

### 16.1 Riscos do Projeto

| ID | Risco | Prob. | Impacto | Mitigação |
|----|-------|-------|---------|-----------|
| R1 | Mudança de requisitos durante desenvolvimento | 🟡 Média | 🔴 Alto | Freeze de escopo após aprovação do PRD. Mudanças vão para backlog de próxima versão. |
| R2 | Atraso na disponibilização de infraestrutura | 🟢 Baixa | 🔴 Alto | Planejar com antecedência. Usar cloud como alternativa. |
| R3 | Falta de disponibilidade de usuários para UAT | 🟡 Média | 🟡 Médio | Agendar UAT com antecedência (6 semanas). Compensação de horas. |
| R4 | Complexidade de integração com Active Directory | 🟡 Média | 🟡 Médio | Fazer PoC cedo. Ter autenticação local como fallback. |
| R5 | Vulnerabilidades de segurança descobertas | 🟢 Baixa | 🔴 Alto | Testes de segurança desde o início. Contratar pentester externo. |
| R6 | Performance insuficiente com grande volume | 🟡 Média | 🔴 Alto | Testes de carga desde o MVP. Otimizar queries e adicionar cache. |
| R7 | Resistência dos usuários à mudança | 🟡 Média | 🔴 Alto | Envolver usuários desde o início. Treinamento adequado. Suporte próximo no go-live. |
| R8 | Saída de membro chave da equipe | 🟢 Baixa | 🔴 Alto | Documentação contínua. Pair programming. Gestão do conhecimento. |
| R9 | Bugs críticos em produção após go-live | 🟡 Média | 🔴 Alto | Testes abrangentes. Soft launch (piloto). Rollback plan. |
| R10 | Não conformidade com LGPD identificada após | 🟢 Baixa | 🔴 Alto | Revisão jurídica antes do go-live. Consultoria especializada. |

**Legenda:**
- Probabilidade: 🟢 Baixa (< 30%), 🟡 Média (30-70%), 🔴 Alta (> 70%)
- Impacto: 🟢 Baixo, 🟡 Médio, 🔴 Alto

### 16.2 Plano de Contingência

**Contingência para R1 (Mudança de requisitos):**
- Manter backlog priorizado
- Avaliar impacto de cada mudança
- Aprovar apenas mudanças críticas
- Agendar mudanças não críticas para próxima versão

**Contingência para R7 (Resistência dos usuários):**
- Fase de convivência: planilha + sistema por 2 meses
- Champions em cada unidade (super usuários)
- Suporte dedicado nas primeiras 2 semanas
- Coleta de feedback contínua

**Contingência para R9 (Bugs críticos em produção):**
- Rollback para versão anterior
- Hotfix prioritário
- Comunicação transparente com usuários
- Post-mortem para evitar recorrência

---

## 17. Métricas de Sucesso e KPIs

### 17.1 KPIs de Adoção

| Métrica | Meta Mês 1 | Meta Mês 3 | Meta Mês 6 |
|---------|------------|------------|------------|
| Usuários ativos mensais | 20 | 50 | 80 |
| Taxa de login semanal | 40% | 70% | 90% |
| Demandas cadastradas | 10 | 50 | 100 |
| Análises concluídas | 5 | 30 | 80 |
| Relatórios gerados | 10 | 60 | 150 |

### 17.2 KPIs de Eficiência

| Métrica | Baseline (Atual) | Meta (6 meses) | Melhoria |
|---------|------------------|----------------|----------|
| Tempo médio para análise de mercado | 4-6 horas | 1-2 horas | -70% |
| Taxa de erro em cálculos | 15% | 0% | -100% |
| Tempo para gerar relatório | 1-2 horas | 2 minutos | -98% |
| Retrabalho por análise | 2 horas | 0 horas | -100% |

### 17.3 KPIs de Qualidade

| Métrica | Meta |
|---------|------|
| Bugs críticos em produção | 0 |
| Bugs médios em produção | < 5 |
| Uptime | ≥ 99% |
| NPS (Net Promoter Score) | ≥ 50 |
| SUS (System Usability Scale) | ≥ 70 |
| CSAT (Customer Satisfaction) | ≥ 4.0/5.0 |

### 17.4 KPIs de Conformidade

| Métrica | Meta |
|---------|------|
| Análises com metodologia correta | 100% |
| Análises com evidências completas | 100% |
| Aprovação em auditorias | 100% |
| Incidentes de segurança | 0 |
| Violações LGPD | 0 |

### 17.5 Como Medir

**Dashboard de Métricas:**
- Integrado ao sistema
- Atualização em tempo real
- Exportável (PDF, XLSX)
- Comparação com períodos anteriores

**Coleta de Feedback:**
- Pesquisa NPS trimestral
- Formulário de satisfação após treinamento
- Botão de feedback em cada tela
- Entrevistas semestrais com usuários

---

## 18. Roadmap Futuro

### 18.1 Funcionalidades Planejadas (2027-2028)

**Integrações:**
- ✨ Integração com ComprasNet (busca automática de preços)
- ✨ Integração com Banco de Preços estaduais
- ✨ Integração com sistema de protocolo
- ✨ Integração com ERP (TOTVS, SAP, etc.)
- ✨ API pública para terceiros

**Inteligência Artificial:**
- 🤖 Geração automática de descrição de itens
- 🤖 Sugestão inteligente de itens similares
- 🤖 Análise preditiva de preços
- 🤖 Detecção de anomalias (preços suspeitos)
- 🤖 Chatbot para suporte

**Mobile:**
- 📱 App nativo (iOS e Android)
- 📱 Notificações push
- 📱 Assinatura digital mobile

**Avançado:**
- 🔐 Assinatura digital ICP-Brasil
- 🔗 Blockchain para rastreabilidade
- 📊 Business Intelligence (BI) integrado
- 🌐 Portal do fornecedor (cotação online)
- 🎯 Módulo de pregão eletrônico

### 18.2 Versões Planejadas

**v2.1 (Trimestre 3/2026):**
- Parametrização de intervalos
- Análise comparativa entre exercícios
- Melhorias de performance

**v2.2 (Trimestre 4/2026):**
- App mobile
- Modo offline (PWA)
- Melhorias de UX

**v3.0 (2027):**
- Integrações externas
- IA para sugestões
- Portal do fornecedor

---

## 19. Glossário

| Termo | Definição |
|-------|-----------|
| **PCA** | Plano de Contratações Anual - documento que consolida todas as contratações previstas para o exercício |
| **Demanda** | Necessidade de contratação identificada e registrada no PCA |
| **Análise de Mercado** | Processo de coleta e análise de preços para estimativa |
| **Mediana** | Valor central de uma série ordenada de números |
| **Intervalo de Aceitação** | Faixa de preços considerados válidos (±25% da mediana) |
| **ETP** | Estudo Técnico Preliminar - documento que fundamenta a contratação |
| **TR** | Termo de Referência - especificação técnica do objeto |
| **SIAFI** | Sistema Integrado de Administração Financeira |
| **CATMAT/CATSER** | Catálogo de Materiais e Serviços do Governo Federal |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018) |
| **MVP** | Minimum Viable Product - versão mínima funcional |
| **UAT** | User Acceptance Testing - testes com usuários finais |
| **SLA** | Service Level Agreement - acordo de nível de serviço |
| **RTO** | Recovery Time Objective - tempo máximo de recuperação |
| **RPO** | Recovery Point Objective - ponto máximo de recuperação |

---

## 20. Anexos

### 20.1 Checklist de Go-Live

**30 dias antes:**
- [ ] Todos os requisitos de prioridade ALTA implementados
- [ ] 90% dos requisitos de prioridade MÉDIA implementados
- [ ] Testes E2E completos e aprovados
- [ ] Testes de performance aprovados
- [ ] Testes de segurança sem vulnerabilidades críticas
- [ ] UAT agendado com usuários

**15 dias antes:**
- [ ] UAT concluído com aprovação
- [ ] Todos os bugs críticos corrigidos
- [ ] 90% dos bugs médios corrigidos
- [ ] Documentação completa (usuário e admin)
- [ ] Vídeos tutoriais produzidos
- [ ] Treinamento agendado

**7 dias antes:**
- [ ] Treinamento de usuários concluído
- [ ] Infraestrutura de produção provisionada
- [ ] Backup e disaster recovery testados
- [ ] Monitoramento configurado
- [ ] Suporte dedicado alocado

**1 dia antes:**
- [ ] Deploy em produção realizado
- [ ] Smoke tests aprovados
- [ ] Dados de produção migrados (se aplicável)
- [ ] Comunicação enviada a todos os usuários
- [ ] Plano de rollback validado

**Dia do Go-Live:**
- [ ] Sistema disponível às 08h
- [ ] Equipe de suporte em standby
- [ ] Monitoramento ativo
- [ ] Comunicação de status em tempo real

**Pós Go-Live (1 semana):**
- [ ] Acompanhamento diário de uso
- [ ] Coleta de feedback
- [ ] Resolução rápida de problemas
- [ ] Ajustes finos conforme necessário
- [ ] Retrospectiva com equipe

### 20.2 Contatos e Responsáveis

**Equipe do Projeto:**
- Product Owner: [Nome] - [email] - [telefone]
- Scrum Master: [Nome] - [email] - [telefone]
- Tech Lead: [Nome] - [email] - [telefone]
- QA Lead: [Nome] - [email] - [telefone]

**Stakeholders:**
- Secretário/Diretor: [Nome] - [email]
- Gestor de Compras: [Nome] - [email]
- Controle Interno: [Nome] - [email]
- TI: [Nome] - [email]
- Jurídico: [Nome] - [email]

**Suporte:**
- E-mail: suporte@sistema.go.gov.br
- Telefone: (62) 3333-4444
- Horário: Segunda a sexta, 08h-18h

### 20.3 Referências

**Legislação:**
- [Decreto Estadual nº 9.900/2021](link)
- [Lei nº 14.133/2021 - Nova Lei de Licitações](link)
- [Lei nº 13.709/2018 - LGPD](link)

**Documentação Técnica:**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [API REST Best Practices](link)

**Padrões de Projeto:**
- [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Twelve-Factor App](https://12factor.net/)
- [Clean Code](link)

---

## Conclusão

Este PRD documenta de forma completa e estruturada o **Sistema de Análise de Mercado para Licitações Públicas**. 

O sistema proposto vai além de uma simples automatização de planilhas: trata-se de uma solução integrada que:
- ✅ Reduz significativamente o tempo de trabalho
- ✅ Elimina erros de cálculo manual
- ✅ Garante conformidade legal e normativa
- ✅ Fornece rastreabilidade completa
- ✅ Facilita auditorias e prestação de contas
- ✅ Promove transparência e eficiência

Com a implementação planejada em 2 fases (MVP em 3 meses + versão completa em 6 meses), o Estado de Goiás terá uma ferramenta moderna, segura e escalável para gestão de suas contratações públicas.

**Próximos Passos:**
1. Aprovação formal do PRD pela alta gestão
2. Alocação de recursos (orçamento e equipe)
3. Kickoff do projeto
4. Sprint 0 (setup e planejamento detalhado)
5. Início do desenvolvimento

---

**Versão:** 2.0 - Completa e Funcional  
**Status:** Aguardando Aprovação  
**Data:** Janeiro de 2026

**Elaborado por:** Equipe de Desenvolvimento  
**Aprovado por:** _________________  
**Data de Aprovação:** ____/____/______

---

**FIM DO PRD - DOCUMENTO COMPLETO**

Este documento foi elaborado em 5 partes para facilitar a leitura e manutenção:
- ✅ Parte 1: Visão Geral, Base Legal, Personas e Escopo
- ✅ Parte 2: Requisitos Funcionais Detalhados
- ✅ Parte 3: Requisitos Não Funcionais e Regras de Negócio
- ✅ Parte 4: Modelo de Dados e Interface do Usuário
- ✅ Parte 5: Testes, Segurança, Cronograma e Roadmap
