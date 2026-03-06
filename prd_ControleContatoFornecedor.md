1. Visão Geral do Produto

1.1 Contexto e Motivação
O Decreto Estadual nº 9.900/2021 do Estado de Goiás institui o Programa de Integridade no âmbito da Administração Pública Estadual, estabelecendo obrigações claras de registro e rastreabilidade dos contatos mantidos entre servidores públicos e representantes de fornecedores, parceiros e terceiros com interesse em processos administrativos ou licitatórios.
A ausência de um sistema estruturado de registro expõe o órgão a riscos de não conformidade, dificulta auditorias e enfraquece a cultura de integridade institucional. Este PRD especifica os requisitos para desenvolvimento de uma solução digital que atenda às exigências do decreto de forma prática e auditável.
1.2 Objetivo do Produto
Desenvolver um sistema web de controle de contatos com fornecedores que permita:
•	Registrar de forma padronizada todos os contatos entre servidores e representantes de fornecedores
•	Garantir trilha de auditoria completa e imutável de todos os registros
•	Gerar relatórios para comprovação de conformidade com o Decreto 9.900/2021
•	Alertar gestores sobre contatos não registrados dentro do prazo
•	Centralizar documentos comprobatórios (atas, e-mails, gravações)
1.3 Público-Alvo
Perfil	Papel no Sistema	Volume Estimado
Servidor Público	Registra contatos	10 a 40 usuários
Administrador de TI	Gestão do sistema	1 a 2 usuários
 
2. Requisitos Legais — Decreto 9.900/2021

2.1 Obrigações Mapeadas do Decreto
Com base na análise do Decreto Estadual nº 9.900/2021, as seguintes obrigações foram identificadas como requisitos diretos para o sistema:
Artigo	Obrigação Legal	Requisito do Sistema
Art. 8º	Registro de reuniões, visitas e contatos com terceiros	Formulário de registro de contatos
Art. 8º	Identificação das partes envolvidas	Campos obrigatórios: servidor, fornecedor, representante
Art. 9º	Prazo para registro do contato	Alerta automático de prazo (24h)
Art. 12	Declaração de ausência de conflito de interesse	Campo de declaração obrigatório
Art. 15	Disponibilidade para órgão de controle	Exportação e acesso para auditores
Art. 18	Guarda e preservação dos registros	Armazenamento seguro, backup e imutabilidade
 
3. Requisitos Funcionais

3.1 Módulo de Cadastro de Fornecedores
O sistema deve manter cadastro centralizado de todos os fornecedores com os quais o órgão mantém ou poderá manter relacionamento.
Campos obrigatórios do cadastro:
•	CNPJ (com validação de formato e dígito verificador)
•	Razão Social e Nome Fantasia
•	Objeto de fornecimento / área de atuação
•	Situação cadastral (Ativo, Suspenso, Inabilitado)
•	Representantes autorizados (nome, CPF, cargo, contatos)
•	Contratos vigentes vinculados
•	Histórico de contatos registrados
3.2 Módulo de Registro de Contatos
Núcleo do sistema. Cada contato com fornecedor deve ser registrado por meio de formulário padronizado, com os seguintes dados:
Campo	Descrição	Obrigatório	Tipo
Data e Hora	Quando ocorreu o contato	Sim	Data/Hora
Tipo de Contato	Reunião, e-mail, telefone, visita, videoconferência	Sim	Seleção
Local / Meio	Presencial, Teams, Zoom, WhatsApp, etc.	Sim	Texto
Fornecedor	Vinculado ao cadastro de fornecedores	Sim	Busca
Representante do Fornecedor	Nome, cargo, CPF	Sim	Busca/Texto
Servidor(es) Envolvido(s)	Matrícula, nome, cargo, setor	Sim	Busca
Pauta / Assunto	Descrição detalhada do que foi tratado	Sim	Texto longo
Resultado / Encaminhamento	Decisões tomadas e próximos passos	Sim	Texto longo
Conflito de Interesse	Declaração de ausência ou existência de conflito	Sim	Declaração
Documentos Anexos	Atas, e-mails, gravações, apresentações	Não	Arquivo
Observações	Informações adicionais relevantes	Não	Texto

