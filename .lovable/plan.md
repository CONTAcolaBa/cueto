# Comentários em carrossel

## O que será feito
- Adicionar comentários opcionais a cada página, armazenando imagem, horário, nome e texto.
- Incluir no formulário de criação e edição uma área para adicionar, revisar e remover comentários.
- Exibir os comentários abaixo da descrição em um carrossel horizontal automático, trocando a cada 3 segundos.
- Seguir o visual de referência: avatar ou iniciais, nome, selo verde “Doador(a)”, horário, texto e indicadores.

## Detalhes técnicos
- Adicionar uma coluna estruturada de comentários às páginas existentes, com valor padrão vazio.
- Validar e normalizar os comentários no servidor antes de salvar.
- Manter o conteúdo dos comentários na renderização inicial da página pública.
- Respeitar movimento reduzido, interrompendo a rotação automática quando essa preferência estiver ativa.
- Verificar criação/edição, página pública em celular e compilação final.
