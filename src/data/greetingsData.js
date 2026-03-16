const GREETING_EXACT = new Set([
  'hi', 'hii', 'hiii', 'hiiii', 'hey', 'heyy', 'hello', 'helo', 'hallo', 'hullo',
  'yo', 'yoo', 'sup', 'wassup', 'whatsup', 'whats up', 'greetings', 'salutations',
  'good morning', 'good afternoon', 'good evening', 'good night',
  'howdy', 'hiya', 'ello', 'bonjour', 'salut', 'coucou', 'bonsoir',
  'hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches',
  'ola', 'oi', 'bom dia', 'boa tarde', 'boa noite',
  'ciao', 'salve', 'buongiorno', 'buonasera',
  'hallochen', 'guten tag', 'guten morgen', 'guten abend',
  'hej', 'hei', 'moin', 'servus', 'gruezi',
  'namaste', 'namaskar', 'salaam', 'salam', 'assalamualaikum', 'asalamualaikum',
  'marhaba', 'ahlan', 'ahlan wa sahlan', 'shalom',
  'ni hao', 'ninhao', 'nee hao', 'zao shang hao', 'wan an',
  'konnichiwa', 'ohayo', 'ohayou', 'konbanwa', 'moshi moshi',
  'annyeong', 'annyeonghaseyo',
  'xin chao', 'chao', 'sawasdee', 'sawasdee krub', 'sawasdee kha',
  'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam',
  'kumusta', 'kamusta',
  'halo', 'apa kabar',
  'hujambo', 'jambo', 'habari',
  'sawubona', 'molo', 'dumela',
  'merhaba', 'selam',
  'privet', 'zdravstvuyte', 'dobry den',
  'ahoj', 'dobry den',
  'szia', 'jo napot',
  'dzie dobry', 'czesc',
  'hei hei', 'god dag', 'godmorgen', 'god kveld',
  'tere', 'labas', 'sveiki',
  'yassas', 'geia sou',
  'selamun aleykum',
  'sain uu', 'tashi delek',
  'selam', 'tena yistilign', 'tena yehun', 'tena yistillin',
  'asalaamu alaykum', 'wa alaykum assalam',
  'kia ora', 'talofa', 'aloha',
  'sat sri akaal', 'ram ram',
  'vanakkam', 'namaskara', 'kem cho', 'radhe radhe',
  'adaab', 'pranam',
  'hello there', 'hey there', 'hi there',
]);

const GREETING_PARTIAL = [
  'hello', 'hi', 'hey', 'yo', 'sup', 'greetings', 'good morning', 'good afternoon',
  'good evening', 'good night', 'howdy', 'hiya', 'bonjour', 'hola', 'ola', 'ciao',
  'namaste', 'namaskar', 'salam', 'salaam', 'marhaba', 'shalom', 'ni hao',
  'konnichiwa', 'annyeong', 'xin chao', 'sawasdee', 'kumusta', 'jambo', 'merhaba',
  'privet', 'ahoj', 'szia', 'czesc', 'selam', 'geia', 'kia ora', 'aloha',
  'vanakkam', 'kem cho', 'ram ram',
];

const WELLBEING_PHRASES = [
  'how are you', 'how are you doing', 'how you doing', 'how are u',
  'hows it going', 'how is it going', 'hows everything', 'how is everything',
  'how have you been', 'what are you up to', 'what is up', 'whats up',
  'whats going on', 'how do you do', 'are you okay', 'you good',
  'how are things', 'everything good', 'you alright', 'howdy do',
];

const CHATTER_PHRASES = [
  'bla bla', 'blah blah', 'blah blah blah', 'la la la', 'just saying hi',
  'random hello', 'just greeting',
];

function normalizeGreetingText(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[[\].,!?;:(){}"`~@#$%^&*_+=|\\/<>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectGreetingIntent(input) {
  const text = normalizeGreetingText(input);
  if (!text) return { isGreeting: false, isWellbeing: false };

  const isExactGreeting = GREETING_EXACT.has(text);
  const hasGreetingFragment = GREETING_PARTIAL.some((phrase) => text.includes(phrase));
  const isWellbeing = WELLBEING_PHRASES.some((phrase) => text.includes(phrase));
  const isChatterGreeting = CHATTER_PHRASES.some((phrase) => text.includes(phrase));

  const isGreeting = isExactGreeting || hasGreetingFragment || isWellbeing || isChatterGreeting;
  if (!isGreeting) return { isGreeting: false, isWellbeing: false };

  const timeOfDay = text.includes('morning')
    ? 'morning'
    : text.includes('afternoon')
      ? 'afternoon'
      : text.includes('evening')
        ? 'evening'
        : text.includes('night')
          ? 'night'
          : null;

  return {
    isGreeting: true,
    isWellbeing,
    timeOfDay,
    normalizedText: text,
  };
}

export function buildGreetingReply(greetingIntent) {
  if (greetingIntent.isWellbeing) {
    return (
      'I am doing great and ready to help. Thanks for asking.\n' +
      'You can ask me about projects, skills, experience, resume, or contact details.'
    );
  }

  if (greetingIntent.timeOfDay === 'morning') {
    return 'Good morning. I am ready to help with Habtamu\'s projects, skills, and experience.';
  }

  if (greetingIntent.timeOfDay === 'afternoon') {
    return 'Good afternoon. Ask me anything about Habtamu\'s portfolio and background.';
  }

  if (greetingIntent.timeOfDay === 'evening' || greetingIntent.timeOfDay === 'night') {
    return 'Good evening. I can help you explore projects, skills, experience, and contact options.';
  }

  return (
    'Hello. Great to meet you.\n' +
    'I can help with:\n' +
    '- Projects and tech stack\n' +
    '- Experience timeline\n' +
    '- Resume and contact info\n' +
    'What would you like to start with?'
  );
}
