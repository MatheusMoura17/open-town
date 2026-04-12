# Feature Specification: Identificação do Jogador (Quick Start)

**Feature Branch**: `001-user-identification`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Funcionalidade de identificação do jogador via formulário simples com nome e foto"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identificação na primeira visita (Priority: P1)

Um novo visitante abre o site sem nenhum dado de identidade salvo. O sistema detecta que o usuário não possui um `displayName` registrado e o redireciona automaticamente para a rota `/quick-start`. O usuário preenche o formulário com seu nome e a URL da sua foto de perfil, visualiza seu ID gerado automaticamente na tela e salva. Ao salvar, é redirecionado para a página principal da aplicação.

**Why this priority**: É o fluxo de entrada obrigatório. Sem identificação, o usuário não pode interagir com nenhuma funcionalidade que dependa de identidade (salas, chat, etc.).

**Independent Test**: Pode ser testado de forma independente acessando o site sem dados salvos, verificando o redirecionamento para `/quick-start`, preenchendo o formulário e confirmando o redirecionamento pós-save.

**Acceptance Scenarios**:

1. **Given** o visitante não possui um `displayName` salvo, **When** ele acessa qualquer rota da aplicação, **Then** é redirecionado para `/quick-start`
2. **Given** o usuário está em `/quick-start`, **When** preenche o nome e a URL da foto e clica em salvar, **Then** um ID único é gerado, os dados são persistidos e o usuário é levado para a página principal
3. **Given** o usuário está em `/quick-start`, **When** tenta salvar sem preencher o nome, **Then** o formulário não é submetido e uma mensagem de erro é exibida

---

### User Story 2 - Retorno de usuário já identificado (Priority: P2)

Um visitante que já se identificou anteriormente reabre o site. O sistema detecta que já existe um `displayName` salvo e o encaminha diretamente para o conteúdo principal, sem exibir novamente a tela de identificação.

**Why this priority**: Garante que usuários recorrentes tenham uma experiência fluida, sem passar por um onboarding repetitivo.

**Independent Test**: Pode ser testado salvando dados de identificação e verificando que o acesso a qualquer rota não redireciona para `/quick-start`.

**Acceptance Scenarios**:

1. **Given** o visitante possui um `displayName` salvo, **When** acessa a aplicação, **Then** é levado diretamente para a página adequada sem passar por `/quick-start`
2. **Given** o visitante possui dados salvos, **When** tenta navegar diretamente para `/quick-start`, **Then** é redirecionado para a página principal (a identificação já foi feita)

---

### User Story 3 - Visualização do ID na tela de identificação (Priority: P3)

O usuário em `/quick-start` consegue visualizar claramente seu ID único na tela, mesmo antes de salvar os dados, para facilitar o compartilhamento do identificador com outros jogadores e para fins de depuração.

**Why this priority**: Requisito de usabilidade e debugging. O ID precisa ser visível para que outros jogadores possam se referenciar e para que erros de identidade possam ser rastreados.

**Independent Test**: Pode ser testado verificando que ao abrir `/quick-start`, o ID (gerado ou existente) está visível na interface antes mesmo de salvar.

**Acceptance Scenarios**:

1. **Given** o usuário acessa `/quick-start`, **When** a página é carregada, **Then** o ID do usuário é exibido de forma visível na tela
2. **Given** o usuário visualiza seu ID em `/quick-start`, **When** salva os dados, **Then** o mesmo ID permanece inalterado nos dados persistidos

---

### Edge Cases

- O que acontece quando o usuário apaga manualmente os dados salvos? O sistema deve tratá-lo como novo visitante e redirecionar para `/quick-start`.
- O que acontece se o usuário tentar salvar um nome vazio ou apenas com espaços? O formulário não deve ser submetido.
- O que acontece se a URL da foto for inválida (não-URL)? A aplicação deve aceitar qualquer string (a validação visual fica a cargo do navegador ao renderizar a imagem), sem bloquear o fluxo.
- O que acontece se o usuário tentar acessar `/quick-start` depois de já estar identificado? Deve ser redirecionado para a página principal.
- O ID gerado na primeira entrada deve permanecer imutável em toda as futuras sessões do mesmo navegador.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE redirecionar automaticamente para `/quick-start` qualquer visitante que não possua um `displayName` registrado
- **FR-002**: A rota `/quick-start` DEVE apresentar um formulário com exatamente 2 campos: nome de exibição e URL da imagem de perfil
- **FR-003**: O campo de nome de exibição é OBRIGATÓRIO; o formulário não pode ser submetido sem ele
- **FR-004**: O campo de URL da imagem de perfil é OPCIONAL; o formulário pode ser submetido mesmo sem ele
- **FR-005**: O sistema DEVE gerar automaticamente um ID único (uuidv4) no momento em que o usuário salva seus dados pela primeira vez
- **FR-006**: O ID gerado JAMAIS deve ser sobrescrito em submissões subsequentes ou atualizações de dados
- **FR-007**: O sistema DEVE exibir o ID do usuário de forma visível na tela `/quick-start` para facilitar o compartilhamento e a depuração
- **FR-008**: Após salvar com sucesso, o usuário DEVE ser redirecionado para a página principal da aplicação
- **FR-009**: Usuários já identificados (com `displayName` salvo) que tentarem acessar `/quick-start` DEVEM ser redirecionados para a página principal
- **FR-010**: Os dados do usuário DEVEM ser persistidos localmente no dispositivo do visitante entre sessões

### Key Entities

- **User**: Representa a identidade do jogador. Contém exatamente três atributos: `id` (string única, uuidv4, imutável após criação), `displayName` (nome escolhido pelo jogador, obrigatório), `pictureUrl` (URL da foto do perfil, opcional). Nenhum outro atributo deve ser adicionado a esta entidade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Novos visitantes completam a identificação em menos de 2 minutos
- **SC-002**: 100% dos visitantes sem `displayName` são redirecionados para `/quick-start` antes de acessar qualquer outra tela
- **SC-003**: O ID do usuário permanece idêntico em 100% das sessões subsequentes no mesmo dispositivo após a identificação inicial
- **SC-004**: 90% dos usuários concluem o preenchimento do formulário com sucesso na primeira tentativa
- **SC-005**: O ID fica visível na tela de identificação em 100% dos acessos à rota `/quick-start`

## Assumptions

- A identidade do usuário é persistida localmente no dispositivo do visitante, sem envio a servidores externos
- Não há sistema de autenticação com senha; a identificação é baseada em dados locais declarados pelo próprio usuário
- O campo `pictureUrl` aceita qualquer string de URL fornecida pelo usuário sem validação de formato obrigatória
- Um jogador pode ter identidades diferentes em dispositivos diferentes; a sincronização entre dispositivos está fora do escopo desta funcionalidade
- A aplicação possui um sistema de rotas já configurado que suporta adição da nova rota `/quick-start`
- O ID gerado é único por device/sessão; não há garantia de unicidade global entre todos os usuários
