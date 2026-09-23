# PageGenius Insights

Crie um aplicativo da web chamado "PageMult" – um gerador leve de microsites com análises.



CONCEITO PRINCIPAL:

Os usuários podem criar microsites simples de uma página a partir de um modelo fixo. O layout/design de cada página é idêntico e bloqueado; apenas o conteúdo (textos, imagens, botão) é editável por página. Cada página criada obtém sua própria rota pública com um link copiável, e o painel rastreia visitas e cliques para cada página individualmente.



ARQUITETURA E RENDERIZAÇÃO (IMPORTANTE):

- Use um framework com suporte nativo a Server-Side Rendering (SSR), como Next.js (App Router).

- A rota pública /p/:slug DEVE ser renderizada no servidor: o conteúdo (título, imagem, subtítulo, descrição, botão) precisa estar presente no HTML já na primeira resposta do servidor, sem depender de fetch client-side após o carregamento inicial. Nada de spinner/loading nessa rota.

- O incremento do contador de "visitas" deve acontecer no servidor, durante a mesma requisição que renderiza a página (ex: em uma Server Component/Server Action, ou API route chamada antes da renderização) — não via chamada disparada pelo cliente depois que a página já montou.

- O incremento do contador de "cliques" no botão CTA pode ser client-side (via API route/endpoint chamado no onClick), já que é uma ação do usuário, não o carregamento da página.

- /login e /dashboard podem ser renderizadas no cliente (CSR) normalmente, pois são áreas autenticadas e não precisam de SEO nem de carregamento instantâneo público.

- Slug deve ter índice único no banco de dados para performance na busca.



ROTAS:

- /login — tela de autenticação

- /dashboard — rota protegida, o aplicativo principal

- /p/:slug — rota pública que renderiza o modelo fixo preenchido com o conteúdo daquela página (ver regras de SSR acima)



PAINEL (/dashboard):

1. Cabeçalho com nome do aplicativo, avatar do usuário e botão de logout.

2. Botão "Nova página" - abre um formulário modal ou deslizante para criar uma página (campos: título, subtítulo, descrição, URL da imagem, texto do botão, link do botão, slug gerado automaticamente a partir do título, mas editável).

3. Uma grade de cartões, um por página, cada cartão mostrando:

   - Título da página + miniatura da imagem

   - Estatísticas: 👁 visitas e 🖱 cliques (grandes, fáceis de ler)

   - O URL público (por exemplo, myapp.com/p/my-slug) com um botão "Copiar link" usando a API da área de transferência, mostrando uma mensagem "Copiado!" como estado de feedback

   - Botão Editar (abre o mesmo formulário pré-preenchido) e botão Excluir (com confirmação)

4. Uma seção de resumo analítico na parte superior: total de páginas, total de visitas, total de cliques em todas as páginas, além de um gráfico de barras simples comparando visitas por página.



MODELO DE PÁGINA PÚBLICA (/p/:slug):

IMPORTANTE: Coloque todo o modelo de página em um único componente dedicado e independente chamado PageTemplate para que ele possa ser redesenhado posteriormente sem alterar nenhuma outra lógica.

Por enquanto, use um design de espaço reservado limpo e mínimo que simplesmente exiba todos os campos de conteúdo: imagem na parte superior, título, subtítulo, descrição e um botão CTA vinculado a button_link. Mantenha-o responsivo a dispositivos móveis. O design visual final será especificado em um prompt futuro – priorize a estrutura e o código limpo em vez do aprimoramento visual.



DETALHES IMPORTANTES:

- A exclusividade do slug deve ser validada (mostrar erro se já existir)

- Somente o proprietário vê suas páginas no dashboard; páginas públicas são visíveis para qualquer pessoa com o link

- Mostrar estados vazios quando o usuário ainda não possui páginas

- Use um tema de painel escuro e profissional (tons de ardósia/zinco) com uma cor de destaque (índigo)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cueto.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/71e7d717-052e-42b9-b774-b0e7a9247c80).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
