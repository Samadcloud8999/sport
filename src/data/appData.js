export const initialData = {
  stats: { athletes: 2847, coaches: 312, sports: 28, medals: 156 },

  heroTitle: {
    ru: { t1: 'ЦЕНТР ПОДГОТОВКИ', t2: 'МОЛОДЁЖНЫХ СБОРНЫХ', t3: 'КЫРГЫЗСКОЙ РЕСПУБЛИКИ', sub: 'Государственное агентство по делам физической культуры и спорта при Кабинете Министров КР' },
    ky: { t1: 'ЖАШТАР КУРАМА', t2: 'КОМАНДАЛАРЫН ДАЯРДОО', t3: 'КЫРГЫЗ РЕСПУБЛИКАСЫ', sub: 'КР Министрлер Кабинетине караштуу Дене тарбия жана спорт иштери боюнча мамлекеттик агенттик' },
    en: { t1: 'YOUTH NATIONAL TEAMS', t2: 'TRAINING CENTER', t3: 'KYRGYZ REPUBLIC', sub: 'State Agency for Physical Culture and Sports under the Cabinet of Ministers of the Kyrgyz Republic' },
  },

  partners: [
    { id:1, name:'Государственное агентство спорта КР', logo:'', url:'#' },
    { id:2, name:'Олимпийский комитет КР', logo:'', url:'#' },
    { id:3, name:'Министерство финансов КР', logo:'', url:'#' },
    { id:4, name:'ВАДА', logo:'', url:'https://www.wada-ama.org' },
    { id:5, name:'Азиатский олимпийский совет', logo:'', url:'#' },
    { id:6, name:'Федерация бокса КР', logo:'', url:'#' },
    { id:7, name:'Федерация борьбы КР', logo:'', url:'#' },
    { id:8, name:'ОАО МегаКом', logo:'', url:'#' },
  ],

  sports: [
    { id:1, name:'Борьба', nameKy:'Күрөш', nameEn:'Wrestling', icon:'🤼', athletes:340, img:'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=600&q=80', desc:'Классическая и вольная борьба. Один из самых популярных видов спорта в Кыргызстане с богатыми традициями.' },
    { id:2, name:'Бокс', nameKy:'Бокс', nameEn:'Boxing', icon:'🥊', athletes:280, img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', desc:'Любительский и профессиональный бокс. Кыргызские боксёры регулярно завоёвывают медали на международных соревнованиях.' },
    { id:3, name:'Лёгкая атлетика', nameKy:'Жеңил атлетика', nameEn:'Athletics', icon:'🏃', athletes:420, img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80', desc:'Бег, прыжки, метание. Комплексная программа подготовки охватывает все дисциплины лёгкой атлетики.' },
    { id:4, name:'Плавание', nameKy:'Сүзүү', nameEn:'Swimming', icon:'🏊', athletes:210, img:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80', desc:'Спортивное плавание во всех стилях. Современный бассейн обеспечивает идеальные условия для подготовки.' },
    { id:5, name:'Дзюдо', nameKy:'Дзюдо', nameEn:'Judo', icon:'🥋', athletes:190, img:'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=600&q=80', desc:'Японское боевое искусство и олимпийский вид спорта. Акцент на технику бросков и болевые приёмы.' },
    { id:6, name:'Гимнастика', nameKy:'Гимнастика', nameEn:'Gymnastics', icon:'🤸', athletes:160, img:'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=600&q=80', desc:'Художественная и спортивная гимнастика. Высокие требования к гибкости, координации и грации.' },
    { id:7, name:'Тяжёлая атлетика', nameKy:'Оор атлетика', nameEn:'Weightlifting', icon:'🏋️', athletes:140, img:'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80', desc:'Рывок и толчок. Кыргызские тяжелоатлеты неоднократно становились призёрами мировых чемпионатов.' },
    { id:8, name:'Стрельба', nameKy:'Мелдеш атуу', nameEn:'Shooting', icon:'🎯', athletes:85, img:'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&q=80', desc:'Пулевая стрельба из различных видов оружия. Точность, концентрация и психологическая устойчивость.' },
    { id:9, name:'Велоспорт', nameKy:'Велоспорт', nameEn:'Cycling', icon:'🚴', athletes:95, img:'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&q=80', desc:'Шоссейный и трековый велоспорт. Горные трассы Кыргызстана — отличная база для подготовки.' },
    { id:10, name:'Таэквондо', nameKy:'Таэквондо', nameEn:'Taekwondo', icon:'🦵', athletes:130, img:'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80', desc:'Корейское боевое искусство. Акцент на высокие удары ногами. Олимпийская дисциплина с 2000 года.' },
    { id:11, name:'Футбол', nameKy:'Футбол', nameEn:'Football', icon:'⚽', athletes:320, img:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', desc:'Молодёжный футбол. Развитие национальной сборной через системную подготовку молодых талантов.' },
    { id:12, name:'Волейбол', nameKy:'Волейбол', nameEn:'Volleyball', icon:'🏐', athletes:180, img:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80', desc:'Пляжный и классический волейбол. Активное развитие в городских и сельских районах республики.' },
  ],

  events: [
    { id:1, title:'Республиканская олимпиада', date:'2025-04-10', location:'Бишкек', sport:'Лёгкая атлетика', slots:120, registered:87 },
    { id:2, title:'Кубок КР по борьбе', date:'2025-04-18', location:'Ош', sport:'Борьба', slots:80, registered:45 },
    { id:3, title:'Первенство по плаванию', date:'2025-05-05', location:'Бишкек', sport:'Плавание', slots:60, registered:32 },
    { id:4, title:'Чемпионат по боксу', date:'2025-05-20', location:'Джалал-Абад', sport:'Бокс', slots:100, registered:61 },
  ],

  athletes: [
    { id:1, name:'Айбек Мамытов', sport:'Борьба', region:'Бишкек', dob:'2005-03-12', rank:'КМС', coach:'Иванов А.', firstCoach:'Дуйшеев К.', medals:3, status:'active', photo:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
      bio:'Начал заниматься борьбой в 8 лет. Призёр республиканских соревнований. Входит в основной состав молодёжной сборной КР.',
      competitions:['Чемпионат КР 2024 — 1 место','Кубок Азии U20 2024 — 3 место','Турнир Анталья 2023 — 2 место'] },
    { id:2, name:'Жанара Асанова', sport:'Лёгкая атлетика', region:'Ош', dob:'2006-07-22', rank:'1 разряд', coach:'Петрова М.', firstCoach:'Омурбеков Б.', medals:1, status:'active', photo:'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&q=80',
      bio:'Специализация — бег на средние дистанции 800м и 1500м. Рекордсменка республики среди юниоров.',
      competitions:['Первенство КР 2024 — 1 место (800м)','Чемпионат ЦА 2024 — 4 место'] },
    { id:3, name:'Темир Бакытов', sport:'Бокс', region:'Чуй', dob:'2004-11-05', rank:'КМС', coach:'Дуйшеев К.', firstCoach:'Аскаров Т.', medals:5, status:'active', photo:'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80',
      bio:'Боксёр весовой категории 63 кг. Многократный призёр национальных и международных соревнований.',
      competitions:['Чемпионат КР 2024 — 1 место','Кубок Азии 2023 — 2 место','Чемпионат мира U22 2023 — 5 место','Турнир им. Баймурзаева — 1 место','Кубок СНГ 2022 — 3 место'] },
    { id:4, name:'Айгуль Токтосунова', sport:'Плавание', region:'Иссык-Куль', dob:'2007-01-30', rank:'1 разряд', coach:'Сидорова Е.', firstCoach:'Назарова Г.', medals:2, status:'active', photo:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80',
      bio:'Специализируется на вольном стиле 100м и 200м. Рекордсменка КР в своей возрастной группе.',
      competitions:['Первенство КР 2024 — 1 место (100м)','Открытый чемпионат Казахстана — 2 место'] },
    { id:5, name:'Нурлан Эшматов', sport:'Дзюдо', region:'Баткен', dob:'2005-09-14', rank:'КМС', coach:'Осмонов Б.', firstCoach:'Токтосунов Д.', medals:4, status:'active', photo:'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80',
      bio:'Дзюдоист весовой категории 73 кг. Победитель Кубка КР трёх последних лет.',
      competitions:['Кубок КР 2024 — 1 место','Первенство ЦА 2024 — 2 место','Турнир Ташкент 2023 — 1 место','Чемпионат КР 2023 — 3 место'] },
    { id:6, name:'Зарина Кулова', sport:'Гимнастика', region:'Ош', dob:'2008-04-18', rank:'2 разряд', coach:'Назарова Г.', firstCoach:'Иванова Л.', medals:0, status:'reserve', photo:'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400&q=80',
      bio:'Перспективная гимнастка. Входит в резервный состав сборной. Специализируется на художественной гимнастике.',
      competitions:['Первенство КР 2024 — 4 место','Открытый турнир Бишкек — 3 место'] },
  ],

  coaches: [
    { id:1, name:'Иванов Александр', sport:'Борьба', region:'Бишкек', exp:15, rank:'ЗТ КР', athletes:12 },
    { id:2, name:'Петрова Марина', sport:'Лёгкая атлетика', region:'Ош', exp:10, rank:'ЗТ КР', athletes:8 },
    { id:3, name:'Дуйшеев Кубан', sport:'Бокс', region:'Чуй', exp:12, rank:'МС КР', athletes:10 },
    { id:4, name:'Осмонов Болот', sport:'Дзюдо', region:'Баткен', exp:8, rank:'МС КР', athletes:7 },
  ],

  applications: [
    { id:1, name:'Адилет Токтосунов', sport:'Борьба', event:'Кубок КР по борьбе', region:'Чуй', date:'2025-03-18', status:'pending', phone:'+996 700 123456', photo:null },
    { id:2, name:'Мира Джумаева', sport:'Лёгкая атлетика', event:'Республиканская олимпиада', region:'Ош', date:'2025-03-17', status:'approved', phone:'+996 555 234567', photo:null },
    { id:3, name:'Расул Байтеков', sport:'Бокс', event:'Чемпионат по боксу', region:'Бишкек', date:'2025-03-16', status:'pending', phone:'+996 700 345678', photo:null },
    { id:4, name:'Айнура Сатыбалдиева', sport:'Плавание', event:'Первенство по плаванию', region:'Иссык-Куль', date:'2025-03-15', status:'rejected', phone:'+996 777 456789', photo:null },
  ],

  news: [
    { id:1, title:'Чемпионат по боксу 2025', date:'2025-03-15', category:'Соревнования', text:'В Бишкеке прошёл республиканский чемпионат по боксу среди молодёжи. Более 200 спортсменов из всех регионов Кыргызстана приняли участие в соревнованиях. Турнир прошёл на высоком уровне, победители отобраны для участия в международных соревнованиях.', img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
    { id:2, title:'Новые тренеры в центре', date:'2025-03-10', category:'Новости', text:'Центр пополнился пятью высококвалифицированными тренерами международного уровня. Среди новых специалистов — призёры Олимпийских игр и чемпионатов мира. Их опыт поможет спортсменам выйти на новый уровень подготовки.', img:'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80' },
    { id:3, title:'Результаты отбора 2025', date:'2025-03-01', category:'Отбор', text:'Опубликованы результаты отборочных соревнований на 2025 год по всем видам спорта. В основной состав сборной вошли 47 спортсменов, ещё 23 включены в резервный список. Следующий этап отбора пройдёт в июне.', img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80' },
    { id:4, title:'Сбор по плаванию', date:'2025-02-20', category:'Подготовка', text:'Учебно-тренировочный сбор по плаванию в Иссык-Кульской области завершился успешно. Спортсмены провели 14 дней в высококачественных условиях, улучшив свои результаты. Тренеры отмечают значительный прогресс всех участников сборов.', img:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80' },
    { id:5, title:'Кыргызские борцы на ЧМ', date:'2025-02-10', category:'Соревнования', text:'Сборная КР по борьбе вернулась с чемпионата мира с тремя медалями. Золото завоевал Айбек Мамытов в весовой категории до 74 кг. Серебро и бронза у представителей вольной борьбы. Успех объясняется планомерной работой тренерского штаба.', img:'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80' },
    { id:6, title:'Открытие нового зала', date:'2025-02-01', category:'Инфраструктура', text:'В центре подготовки открылся новый многофункциональный спортивный зал площадью 2400 кв.м. Зал оснащён современным оборудованием ведущих европейских производителей. Теперь тренироваться одновременно смогут до 120 спортсменов.', img:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80' },
  ],

  regions: [
    { id:'bishkek', name:'Бишкек', schools:45, athletes:680, coaches:89, lat:42.87, lon:74.59, img:'https://images.unsplash.com/photo-1565530940047-45b9cdba0f6e?w=400&q=70', desc:'Столица и главный спортивный центр республики' },
    { id:'chui', name:'Чуйская', schools:38, athletes:520, coaches:67, lat:42.9, lon:73.5, img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70', desc:'Развитая спортивная инфраструктура и сильные традиции' },
    { id:'osh', name:'Ошская', schools:32, athletes:410, coaches:54, lat:40.5, lon:72.8, img:'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=70', desc:'Южная столица с богатыми спортивными традициями' },
    { id:'jalal', name:'Джалал-Абадская', schools:28, athletes:340, coaches:43, lat:40.93, lon:73.0, img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70', desc:'Активное развитие детского спорта в регионе' },
    { id:'issyk', name:'Иссык-Кульская', schools:22, athletes:280, coaches:35, lat:42.5, lon:77.5, img:'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&q=70', desc:'Горные условия для подготовки выносливости' },
    { id:'naryn', name:'Нарынская', schools:18, athletes:210, coaches:27, lat:41.43, lon:75.99, img:'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=70', desc:'Высокогорный регион с уникальными условиями тренировок' },
    { id:'talas', name:'Таласская', schools:15, athletes:180, coaches:22, lat:42.52, lon:72.24, img:'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=70', desc:'Родина национальных игр и традиционных видов спорта' },
    { id:'batken', name:'Баткенская', schools:20, athletes:190, coaches:28, lat:40.06, lon:70.82, img:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70', desc:'Динамично развивающийся регион на юго-западе' },
    { id:'oshcity', name:'Ош (город)', schools:25, athletes:320, coaches:42, lat:40.52, lon:72.79, img:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=70', desc:'Второй город страны с сильными спортивными школами' },
  ],

  finances: {
    income:   [2400000,2100000,2800000,2600000,3100000,2900000].map((v,i)=>({month:['Янв','Фев','Мар','Апр','Май','Июн'][i],v})),
    expenses: [1800000,1600000,2100000,1900000,2400000,2200000].map((v,i)=>({month:['Янв','Фев','Мар','Апр','Май','Июн'][i],v})),
    categories:[{name:'Зарплаты',pct:45},{name:'Инвентарь',pct:20},{name:'Сборы',pct:18},{name:'Соревнования',pct:12},{name:'Прочее',pct:5}],
  },

  gallery: [
    { id:1, img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&q=80', cat:'Соревнования', title:'Чемпионат по лёгкой атлетике', date:'2025-03-15' },
    { id:2, img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=80', cat:'Бокс', title:'Республиканский турнир по боксу', date:'2025-03-10' },
    { id:3, img:'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=700&q=80', cat:'Борьба', title:'Кубок КР по борьбе', date:'2025-03-05' },
    { id:4, img:'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=700&q=80', cat:'Подготовка', title:'Учебно-тренировочный сбор', date:'2025-02-28' },
    { id:5, img:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80', cat:'Плавание', title:'Первенство по плаванию', date:'2025-02-20' },
    { id:6, img:'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=700&q=80', cat:'Гимнастика', title:'Художественная гимнастика', date:'2025-02-15' },
  ],

  departments: [
    { id:'hr',       name:'Отдел кадров',           icon:'Users',        color:'#3b82f6' },
    { id:'finance',  name:'Бухгалтерия',             icon:'DollarSign',   color:'#22c55e' },
    { id:'edu',      name:'Образовательная часть',   icon:'GraduationCap',color:'#8b5cf6' },
    { id:'antidope', name:'Антидопинговый отдел',    icon:'ShieldCheck',  color:'#ef4444' },
    { id:'medical',  name:'Медицинский отдел',       icon:'HeartPulse',   color:'#ec4899' },
    { id:'sport',    name:'Спортивный отдел',        icon:'Trophy',       color:'#f59e0b' },
    { id:'it',       name:'IT и цифровые технологии',icon:'Monitor',      color:'#06b6d4' },
    { id:'legal',    name:'Юридический отдел',       icon:'Scale',        color:'#64748b' },
    { id:'press',    name:'Пресс-служба',            icon:'Newspaper',    color:'#84cc16' },
    { id:'intl',     name:'Международный отдел',     icon:'Globe',        color:'#f97316' },
  ],

  staffUsers: [
    { id:'s1', name:'Айнура Бекова',     dept:'hr',       role:'Начальник отдела кадров',    login:'hr',       pass:'hr123',       avatar:'https://i.pravatar.cc/40?img=1', approved:true },
    { id:'s2', name:'Бакыт Осмонов',     dept:'finance',  role:'Главный бухгалтер',          login:'finance',  pass:'finance123',  avatar:'https://i.pravatar.cc/40?img=3', approved:true },
    { id:'s3', name:'Гульнара Иванова',  dept:'edu',      role:'Методист',                   login:'edu',      pass:'edu123',      avatar:'https://i.pravatar.cc/40?img=5', approved:true },
    { id:'s4', name:'Денис Ким',         dept:'antidope', role:'Антидопинговый офицер',      login:'antidope', pass:'anti123',     avatar:'https://i.pravatar.cc/40?img=7', approved:true },
    { id:'s5', name:'Элина Сатыбалдиева',dept:'medical',  role:'Главный врач',               login:'medical',  pass:'med123',      avatar:'https://i.pravatar.cc/40?img=9', approved:true },
    { id:'s6', name:'Канат Токтосунов',  dept:'sport',    role:'Спортивный директор',        login:'sport',    pass:'sport123',    avatar:'https://i.pravatar.cc/40?img=11', approved:true },
    { id:'s7', name:'Мадина Джумаева',   dept:'it',       role:'IT специалист',              login:'it',       pass:'it123',       avatar:'https://i.pravatar.cc/40?img=13', approved:true },
    { id:'s8', name:'Нуржан Алиев',      dept:'legal',    role:'Юрисконсульт',               login:'legal',    pass:'legal123',    avatar:'https://i.pravatar.cc/40?img=15', approved:true },
    { id:'s9', name:'Олжас Бейшенов',   dept:'press',    role:'Пресс-секретарь',            login:'press',    pass:'press123',    avatar:'https://i.pravatar.cc/40?img=17', approved:true },
    { id:'s10',name:'Перизат Мамытова', dept:'intl',     role:'Зав. международным отделом', login:'intl',     pass:'intl123',     avatar:'https://i.pravatar.cc/40?img=19', approved:true },
  ],

  staffTasks: [
    { id:1, title:'Обновить личные дела спортсменов', dept:'hr',       assignee:'s1', status:'progress', priority:'high',  dueDate:'2025-04-05', desc:'Проверить и обновить документацию всех зарегистрированных спортсменов' },
    { id:2, title:'Квартальный финансовый отчёт',     dept:'finance',  assignee:'s2', status:'todo',     priority:'high',  dueDate:'2025-04-10', desc:'Подготовить финансовый отчёт за 1 квартал 2025 года' },
    { id:3, title:'Разработать учебную программу',    dept:'edu',      assignee:'s3', status:'progress', priority:'medium',dueDate:'2025-04-15', desc:'Методические материалы для новых тренеров' },
    { id:4, title:'Антидопинговый семинар',           dept:'antidope', assignee:'s4', status:'todo',     priority:'high',  dueDate:'2025-04-20', desc:'Организовать обучающий семинар для спортсменов' },
    { id:5, title:'Медосмотр сборной',                dept:'medical',  assignee:'s5', status:'done',     priority:'high',  dueDate:'2025-03-30', desc:'Плановый медицинский осмотр всех спортсменов сборной' },
    { id:6, title:'Подготовка к соревнованиям',       dept:'sport',    assignee:'s6', status:'progress', priority:'high',  dueDate:'2025-04-08', desc:'Технические аспекты подготовки к республиканской олимпиаде' },
    { id:7, title:'Обновление веб-сайта',             dept:'it',       assignee:'s7', status:'done',     priority:'medium',dueDate:'2025-03-28', desc:'Обновить информацию о соревнованиях на официальном сайте' },
    { id:8, title:'Договор с федерацией',             dept:'legal',    assignee:'s8', status:'todo',     priority:'medium',dueDate:'2025-04-25', desc:'Подготовить договор сотрудничества' },
    { id:9, title:'Пресс-релиз о чемпионате',         dept:'press',    assignee:'s9', status:'done',     priority:'low',   dueDate:'2025-03-20', desc:'Написать и опубликовать пресс-релиз' },
    { id:10,title:'Международный турнир 2025',        dept:'intl',     assignee:'s10',status:'progress', priority:'high',  dueDate:'2025-05-01', desc:'Координация участия КР в международных соревнованиях' },
  ],

  staffChat: [
    { id:1, from:'s1', to:'all', text:'Добрый день всем! Напоминаю о совещании в 14:00.', time:'09:15', date:'2025-03-23' },
    { id:2, from:'s2', to:'all', text:'Принял, буду присутствовать.', time:'09:18', date:'2025-03-23' },
    { id:3, from:'s6', to:'all', text:'Подготовил отчёт по тренировочным сборам, прикреплю файл.', time:'09:32', date:'2025-03-23' },
    { id:4, from:'s3', to:'all', text:'Отличная работа! Жду отчёт.', time:'09:35', date:'2025-03-23' },
    { id:5, from:'s5', to:'all', text:'Медосмотр завершён, все спортсмены допущены к соревнованиям.', time:'10:02', date:'2025-03-23' },
  ],

  attendance: {},
  sharedFiles: [
    { id:1, name:'Финансовый отчёт Q1 2025.pdf',   dept:'finance', uploadedBy:'s2', date:'2025-03-20', size:'2.4 МБ',  type:'pdf' },
    { id:2, name:'Список спортсменов сборной.xlsx', dept:'sport',   uploadedBy:'s6', date:'2025-03-19', size:'856 КБ',  type:'xlsx' },
    { id:3, name:'Медицинские заключения.docx',     dept:'medical', uploadedBy:'s5', date:'2025-03-18', size:'1.1 МБ',  type:'docx' },
    { id:4, name:'Учебный план 2025.pdf',           dept:'edu',     uploadedBy:'s3', date:'2025-03-17', size:'3.2 МБ',  type:'pdf' },
    { id:5, name:'Антидопинговый протокол.pdf',     dept:'antidope',uploadedBy:'s4', date:'2025-03-16', size:'980 КБ',  type:'pdf' },
  ],
}
