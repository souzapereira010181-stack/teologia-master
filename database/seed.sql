-- Teologia Master - Dados de exemplo

INSERT INTO courses (title, description, modules) VALUES
('Fundamentos da Teologia Sistemática', 'Introdução aos grandes temas da teologia: Deus, revelação, criação e salvação.',
 '[{"title":"O que é Teologia?","type":"text"},{"title":"Revelação Geral e Especial","type":"text"},{"title":"Doutrina de Deus","type":"text"}]'),
('Panorama do Antigo Testamento', 'Estudo introdutório dos livros históricos, poéticos e proféticos.',
 '[{"title":"Pentateuco","type":"text"},{"title":"Livros Históricos","type":"text"},{"title":"Profetas Maiores e Menores","type":"text"}]'),
('Panorama do Novo Testamento', 'Estudo dos Evangelhos, Atos, Cartas e Apocalipse.',
 '[{"title":"Os Quatro Evangelhos","type":"text"},{"title":"Atos dos Apóstolos","type":"text"},{"title":"Cartas Paulinas","type":"text"}]');

-- Versículos de exemplo (Nova Versão Internacional)
INSERT INTO bible_verses (translation, book, chapter, verse, text) VALUES
('Nova Versão Internacional', 'Gênesis', 1, 1, 'No princípio Deus criou os céus e a terra.'),
('Nova Versão Internacional', 'Gênesis', 1, 2, 'Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.'),
('Nova Versão Internacional', 'Salmos', 23, 1, 'O Senhor é o meu pastor; de nada terei falta.'),
('Nova Versão Internacional', 'Salmos', 23, 2, 'Em verdes pastagens me faz repousar e me conduz a águas tranquilas.'),
('Nova Versão Internacional', 'João', 3, 16, 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.'),
('Nova Versão Internacional', 'Romanos', 8, 28, 'Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.'),
('Nova Versão Internacional', 'Filipenses', 4, 13, 'Tudo posso naquele que me fortalece.');

-- Versículos de exemplo (Almeida Revista e Corrigida)
INSERT INTO bible_verses (translation, book, chapter, verse, text) VALUES
('Almeida Revista e Corrigida', 'Gênesis', 1, 1, 'No princípio, criou Deus os céus e a terra.'),
('Almeida Revista e Corrigida', 'Salmos', 23, 1, 'O Senhor é o meu pastor, nada me faltará.'),
('Almeida Revista e Corrigida', 'João', 3, 16, 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.');
