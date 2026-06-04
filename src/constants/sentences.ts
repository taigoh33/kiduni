
export interface GameSentence {
  id: string;
  tokens: {
    zh: string[];
    en: string[];
    ms: string[];
  };
  imageUrl: string;
}

export const GAME_SENTENCES: GameSentence[] = [
  {
    id: 's1',
    tokens: {
      zh: ['太阳', '公公', '起床', '了'],
      en: ['Mr.', 'Sun', 'is', 'awake'],
      ms: ['Tuan', 'Matahari', 'telah', 'bangun']
    },
    imageUrl: 'https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's2',
    tokens: {
      zh: ['小猫', '正在', '睡觉'],
      en: ['The', 'cat', 'is', 'sleeping'],
      ms: ['Kucing', 'itu', 'sedang', 'tidur']
    },
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's3',
    tokens: {
      zh: ['苹果', '红', '通', '通'],
      en: ['The', 'apple', 'is', 'very', 'red'],
      ms: ['Epal', 'itu', 'sangat', 'merah']
    },
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's4',
    tokens: {
      zh: ['我', '会', '自己', '刷牙'],
      en: ['I', 'can', 'brush', 'teeth', 'myself'],
      ms: ['Saya', 'boleh', 'berus', 'gigi', 'sendiri']
    },
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e3b291a0a254?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's5',
    tokens: {
      zh: ['小鱼', '在', '水里', '游'],
      en: ['Small', 'fish', 'swim', 'in', 'water'],
      ms: ['Ikan', 'kecil', 'berenang', 'dalam', 'air']
    },
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's6',
    tokens: {
      zh: ['草地', '绿', '油', '油'],
      en: ['The', 'grass', 'is', 'very', 'green'],
      ms: ['Rumput', 'itu', 'sangat', 'hijau']
    },
    imageUrl: 'https://images.unsplash.com/photo-1533460004989-cef01064af7c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's7',
    tokens: {
      zh: ['爸爸', '开车', '去', '上班'],
      en: ['Dad', 'drives', 'to', 'work'],
      ms: ['Ayah', 'memandu', 'ke', 'tempat', 'kerja']
    },
    imageUrl: 'https://images.unsplash.com/photo-1449965072633-5674a675529f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's8',
    tokens: {
      zh: ['妈妈', '煮的', '菜', '好香'],
      en: ['The', 'food', 'mom', 'cooks', 'smells', 'good'],
      ms: ['Masakan', 'ibu', 'berbau', 'sangat', 'harum']
    },
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's9',
    tokens: {
      zh: ['我们', '一起', '玩', '游戏'],
      en: ['We', 'play', 'games', 'together'],
      ms: ['Kami', 'bermain', 'permainan', 'bersama-sama']
    },
    imageUrl: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's10',
    tokens: {
      zh: ['大象', '的', '鼻子', '很长'],
      en: ['The', 'elephant', 'has', 'a', 'long', 'nose'],
      ms: ['Gajah', 'itu', 'mempunyai', 'belalai', 'yang', 'panjang']
    },
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's11',
    tokens: {
      zh: ['天上', '有', '亮晶晶', '的', '星星'],
      en: ['There', 'are', 'twinkling', 'stars', 'in', 'the', 'sky'],
      ms: ['Ada', 'bintang', 'berkelip-kelip', 'di', 'langit']
    },
    imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's12',
    tokens: {
      zh: ['兔子', '爱', '吃', '萝卜'],
      en: ['Rabbits', 'love', 'to', 'eat', 'carrots'],
      ms: ['Arnab', 'suka', 'makan', 'lobak']
    },
    imageUrl: 'https://images.unsplash.com/photo-1585110396054-c8112ca9625f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's13',
    tokens: {
      zh: ['下雨', '了', '要', '撑伞'],
      en: ['It', 'is', 'raining', 'need', 'an', 'umbrella'],
      ms: ['Hari', 'hujan', 'perlu', 'bawa', 'payung']
    },
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's14',
    tokens: {
      zh: ['蜜蜂', '在', '花丛中', '飞'],
      en: ['Bees', 'fly', 'among', 'the', 'flowers'],
      ms: ['Lebah', 'terbang', 'di', 'celah', 'bunga']
    },
    imageUrl: 'https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's15',
    tokens: {
      zh: ['老师', '教', '我们', '唱歌'],
      en: ['Teacher', 'teaches', 'us', 'to', 'sing'],
      ms: ['Cikgu', 'mengajar', 'kami', 'menyanyi']
    },
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's16',
    tokens: {
      zh: ['多吃', '水果', '身体', '好'],
      en: ['Eating', 'more', 'fruit', 'is', 'good'],
      ms: ['Makan', 'banyak', 'buah', 'baik', 'untuk', 'badan']
    },
    imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's17',
    tokens: {
      zh: ['这里的', '风景', '真', '漂亮'],
      en: ['The', 'scenery', 'here', 'is', 'really', 'beautiful'],
      ms: ['Pemandangan', 'di', 'sini', 'sungguh', 'cantik']
    },
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's18',
    tokens: {
      zh: ['请', '帮我', '拿', '这个'],
      en: ['Please', 'help', 'me', 'take', 'this'],
      ms: ['Sila', 'bantu', 'saya', 'ambil', 'ini']
    },
    imageUrl: 'https://images.unsplash.com/photo-1534120247760-c44c5e4a62f1?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's19',
    tokens: {
      zh: ['我', '已经', '长大', '了'],
      en: ['I', 'have', 'already', 'grown', 'up'],
      ms: ['Saya', 'sudah', 'besar', 'sekarang']
    },
    imageUrl: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's20',
    tokens: {
      zh: ['弟弟', '正在', '玩', '积木'],
      en: ['Brother', 'is', 'playing', 'with', 'blocks'],
      ms: ['Adik', 'sedang', 'bermain', 'bongkas']
    },
    imageUrl: 'https://images.unsplash.com/photo-1587654062353-d02bc70c3407?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's21',
    tokens: {
      zh: ['蝴蝶', '的', '翅膀', '很美'],
      en: ['The', 'butterfly', 'wings', 'are', 'pretty'],
      ms: ['Sayap', 'rama-rama', 'sangat', 'cantik']
    },
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's22',
    tokens: {
      zh: ['月亮', '弯弯', '像', '小船'],
      en: ['The', 'moon', 'is', 'curved', 'like', 'a', 'boat'],
      ms: ['Bulan', 'sabit', 'seperti', 'perahu', 'kecil']
    },
    imageUrl: 'https://images.unsplash.com/photo-1495195129352-aec325b55b65?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's23',
    tokens: {
      zh: ['我', '每天', '准时', '睡觉'],
      en: ['I', 'go', 'to', 'sleep', 'on', 'time'],
      ms: ['Saya', 'tidur', 'tepat', 'pada', 'masanya']
    },
    imageUrl: 'https://images.unsplash.com/photo-1520206111019-247aaad7d3b0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's24',
    tokens: {
      zh: ['洗洗手', '讲', '卫生'],
      en: ['Wash', 'hands', 'for', 'good', 'hygiene'],
      ms: ['Basuh', 'tangan', 'untuk', 'kebersihan']
    },
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's25',
    tokens: {
      zh: ['猴子', '爬树', '很快'],
      en: ['Monkeys', 'climb', 'trees', 'very', 'fast'],
      ms: ['Monyet', 'panjat', 'pokok', 'dengan', 'pantas']
    },
    imageUrl: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's26',
    tokens: {
      zh: ['西瓜', '大', '又', '圆'],
      en: ['Watermelon', 'is', 'big', 'and', 'round'],
      ms: ['Tembikai', 'besar', 'dan', 'bulat']
    },
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's27',
    tokens: {
      zh: ['火车', '轰隆隆', '跑过来'],
      en: ['The', 'train', 'comes', 'rumbling', 'along'],
      ms: ['Kereta', 'api', 'datang', 'dengan', 'bunyi', 'bingit']
    },
    imageUrl: 'https://images.unsplash.com/photo-1535492193556-9137d57fc52e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's28',
    tokens: {
      zh: ['面包', '软', '绵', '绵'],
      en: ['The', 'bread', 'is', 'soft', 'and', 'fluffy'],
      ms: ['Roti', 'itu', 'sangat', 'lembut']
    },
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's29',
    tokens: {
      zh: ['书包', '里面', '有', '课本'],
      en: ['There', 'are', 'textbooks', 'in', 'the', 'bag'],
      ms: ['Ada', 'buku', 'teks', 'di', 'dalam', 'beg']
    },
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's30',
    tokens: {
      zh: ['公园里', '有', '很多', '花'],
      en: ['There', 'are', 'many', 'flowers', 'in', 'the', 'park'],
      ms: ['Terdapat', 'banyak', 'bunga', 'di', 'taman']
    },
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's31',
    tokens: {
      zh: ['青蛙', '呱', '呱', '叫'],
      en: ['The', 'frog', 'is', 'croaking'],
      ms: ['Katak', 'itu', 'sedang', 'berbunyi']
    },
    imageUrl: 'https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's32',
    tokens: {
      zh: ['彩虹', '有', '七个', '颜色'],
      en: ['The', 'rainbow', 'has', 'seven', 'colors'],
      ms: ['Pelangi', 'ada', 'tujuh', 'warna']
    },
    imageUrl: 'https://images.unsplash.com/photo-1443926818681-717d074a57af?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's33',
    tokens: {
      zh: ['医生', '帮我', '看病'],
      en: ['The', 'doctor', 'treats', 'my', 'illness'],
      ms: ['Doktor', 'merawat', 'penyakit', 'saya']
    },
    imageUrl: 'https://images.unsplash.com/photo-1505751172676-17ad2222095d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's34',
    tokens: {
      zh: ['警察', '叔叔', '真', '勇敢'],
      en: ['The', 'policeman', 'is', 'very', 'brave'],
      ms: ['Abang', 'polis', 'sangat', 'berani']
    },
    imageUrl: 'https://images.unsplash.com/photo-1566860012270-4cc8e137171d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's35',
    tokens: {
      zh: ['喝水', '皮肤', '好'],
      en: ['Drinking', 'water', 'is', 'good', 'for', 'skin'],
      ms: ['Minum', 'air', 'baik', 'untuk', 'kulit']
    },
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's36',
    tokens: {
      zh: ['鸟儿', '在', '树上', '唱歌'],
      en: ['Birds', 'are', 'singing', 'in', 'the', 'tree'],
      ms: ['Burung', 'menyanyi', 'di', 'atas', 'pokok']
    },
    imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's37',
    tokens: {
      zh: ['我', '爱', '我的', '家人'],
      en: ['I', 'love', 'my', 'family', 'members'],
      ms: ['Saya', 'sayang', 'ahli', 'keluarga', 'saya']
    },
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's38',
    tokens: {
      zh: ['我们', '去', '动物园', '玩'],
      en: ['We', 'go', 'to', 'the', 'zoo', 'to', 'play'],
      ms: ['Kami', 'pergi', 'ke', 'zoo', 'untuk', 'bermain']
    },
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's39',
    tokens: {
      zh: ['冬天', '会', '下雪'],
      en: ['It', 'will', 'snow', 'in', 'winter'],
      ms: ['Salji', 'akan', 'turun', 'pada', 'musim', 'sejuk']
    },
    imageUrl: 'https://images.unsplash.com/photo-1483664856219-af38d68249a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's40',
    tokens: {
      zh: ['晚上', '可以', '看到', '月亮'],
      en: ['You', 'can', 'see', 'the', 'moon', 'at', 'night'],
      ms: ['Anda', 'boleh', 'nampak', 'bulan', 'pada', 'waktu', 'malam']
    },
    imageUrl: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's41',
    tokens: {
      zh: ['闹钟', '叮当', '响'],
      en: ['The', 'alarm', 'clock', 'is', 'ringing'],
      ms: ['Jam', 'loceng', 'sedang', 'berbunyi']
    },
    imageUrl: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's42',
    tokens: {
      zh: ['气球', '飞上', '了', '天'],
      en: ['The', 'balloon', 'flew', 'to', 'the', 'sky'],
      ms: ['Belon', 'itu', 'terbang', 'ke', 'langit']
    },
    imageUrl: 'https://images.unsplash.com/photo-1507502707541-f369a3b18502?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's43',
    tokens: {
      zh: ['面条', '长', '又', '细'],
      en: ['Noodles', 'are', 'long', 'and', 'thin'],
      ms: ['Mie', 'itu', 'panjang', 'dan', 'halus']
    },
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's44',
    tokens: {
      zh: ['牛奶', '营养', '丰富'],
      en: ['Milk', 'is', 'rich', 'in', 'nutrition'],
      ms: ['Susu', 'kaya', 'dengan', 'nutrisi']
    },
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9107d6d1f50?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's45',
    tokens: {
      zh: ['公共汽车', '到站', '了'],
      en: ['The', 'bus', 'has', 'arrived', 'at', 'the', 'station'],
      ms: ['Bas', 'telah', 'sampai', 'ke', 'stesen']
    },
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's46',
    tokens: {
      zh: ['飞机', '在', '云朵里', '穿行'],
      en: ['The', 'plane', 'flies', 'through', 'the', 'clouds'],
      ms: ['Kapal', 'terbang', 'melalui', 'celah', 'awan']
    },
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's47',
    tokens: {
      zh: ['这里的', '冰淇淋', '好甜'],
      en: ['The', 'ice', 'cream', 'here', 'is', 'sweet'],
      ms: ['Aiskrim', 'di', 'sini', 'sangat', 'manis']
    },
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's48',
    tokens: {
      zh: ['同学们', '一起', '上课'],
      en: ['Students', 'have', 'class', 'together'],
      ms: ['Pelajar', 'belajar', 'bersama-sama', 'di', 'kelas']
    },
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's49',
    tokens: {
      zh: ['垃圾', '要', '丢进', '桶里'],
      en: ['Trash', 'should', 'be', 'thrown', 'in', 'the', 'bin'],
      ms: ['Sampah', 'mesti', 'dibuang', 'ke', 'dalam', 'tong']
    },
    imageUrl: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's50',
    tokens: {
      zh: ['小朋友们', '笑', '嘻', '嘻'],
      en: ['The', 'children', 'are', 'smiling', 'happily'],
      ms: ['Kanak-kanak', 'ketawa', 'dengan', 'gembira']
    },
    imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's51',
    tokens: {
      zh: ['猫咪', '爬上', '了', '树梢'],
      en: ['The', 'cat', 'climbed', 'up', 'the', 'tree'],
      ms: ['Kucing', 'itu', 'memanjat', 'ke', 'atas', 'pokok']
    },
    imageUrl: ''
  },
  {
    id: 's52',
    tokens: {
      zh: ['今天', '是', '一个', '大晴天'],
      en: ['Today', 'is', 'a', 'beautiful', 'sunny', 'day'],
      ms: ['Hari', 'ini', 'ialah', 'hari', 'yang', 'cerah']
    },
    imageUrl: ''
  },
  {
    id: 's53',
    tokens: {
      zh: ['我', '最喜欢', '喝', '橙汁'],
      en: ['I', 'like', 'drinking', 'orange', 'juice', 'best'],
      ms: ['Saya', 'paling', 'suka', 'minum', 'jus', 'oren']
    },
    imageUrl: ''
  },
  {
    id: 's54',
    tokens: {
      zh: ['小鸟', '在', '枝头', '唱歌'],
      en: ['The', 'little', 'bird', 'is', 'singing', 'on', 'the', 'branch'],
      ms: ['Burung', 'kecil', 'bernyanyi', 'di', 'atas', 'dahan']
    },
    imageUrl: ''
  },
  {
    id: 's55',
    tokens: {
      zh: ['爸爸', '买了', '一个', '大西瓜'],
      en: ['Dad', 'bought', 'a', 'big', 'watermelon'],
      ms: ['Ayah', 'membeli', 'biji', 'tembikai', 'yang', 'besar']
    },
    imageUrl: ''
  },
  {
    id: 's56',
    tokens: {
      zh: ['妹妹', '在', '画', '一朵花'],
      en: ['My', 'little', 'sister', 'is', 'drawing', 'a', 'flower'],
      ms: ['Adik', 'perempuan', 'saya', 'sedang', 'melukis', 'sekuntum', 'bunga']
    },
    imageUrl: ''
  },
  {
    id: 's57',
    tokens: {
      zh: ['夜晚', '的', '星星', '亮晶晶'],
      en: ['The', 'stars', 'of', 'night', 'are', 'bright'],
      ms: ['Bintang', 'pada', 'waktu', 'malam', 'sangat', 'terang']
    },
    imageUrl: ''
  },
  {
    id: 's58',
    tokens: {
      zh: ['我们', '在', '图书馆', '看书'],
      en: ['We', 'read', 'books', 'in', 'the', 'library'],
      ms: ['Kami', 'membaca', 'buku', 'di', 'perpustakaan']
    },
    imageUrl: ''
  },
  {
    id: 's59',
    tokens: {
      zh: ['太阳', '从', '东方', '升起'],
      en: ['The', 'sun', 'rises', 'from', 'the', 'east'],
      ms: ['Matahari', 'terbit', 'dari', 'arah', 'timur']
    },
    imageUrl: ''
  },
  {
    id: 's60',
    tokens: {
      zh: ['彩虹', '有', '七种', '颜色'],
      en: ['The', 'rainbow', 'has', 'seven', 'colors'],
      ms: ['Pelangi', 'mempunyai', 'tujuh', 'warna']
    },
    imageUrl: ''
  },
  {
    id: 's61',
    tokens: {
      zh: ['小狗', '咬着', '一根', '骨头'],
      en: ['The', 'dog', 'is', 'chewing', 'a', 'bone'],
      ms: ['Anjing', 'itu', 'menggonggong', 'sebatang', 'tulang']
    },
    imageUrl: ''
  },
  {
    id: 's62',
    tokens: {
      zh: ['秋天', '的', '树叶', '变黄', '了'],
      en: ['The', 'leaves', 'turned', 'yellow', 'in', 'autumn'],
      ms: ['Daun-daun', 'menjadi', 'kuning', 'pada', 'musim', 'luruh']
    },
    imageUrl: ''
  },
  {
    id: 's63',
    tokens: {
      zh: ['哥哥', '正在', '踢', '足球'],
      en: ['Big', 'brother', 'is', 'playing', 'soccer'],
      ms: ['Abang', 'sedang', 'bermain', 'bola', 'sepak']
    },
    imageUrl: ''
  },
  {
    id: 's64',
    tokens: {
      zh: ['医生', '在', '医院', '工作'],
      en: ['The', 'doctor', 'works', 'at', 'the', 'hospital'],
      ms: ['Doktor', 'bekerja', 'di', 'hospital']
    },
    imageUrl: ''
  },
  {
    id: 's65',
    tokens: {
      zh: ['天上', '飘着', '白白的', '云朵'],
      en: ['White', 'clouds', 'are', 'floating', 'in', 'the', 'sky'],
      ms: ['Awan', 'putih', 'sedang', 'terapung', 'di', 'langit']
    },
    imageUrl: ''
  },
  {
    id: 's66',
    tokens: {
      zh: ['大熊猫', '喜欢', '吃', '竹条'],
      en: ['Giant', 'pandas', 'love', 'to', 'eat', 'bamboo'],
      ms: ['Panda', 'gergasi', 'suka', 'makan', 'buluh']
    },
    imageUrl: ''
  },
  {
    id: 's67',
    tokens: {
      zh: ['放学', '了', '我要', '回家'],
      en: ['School', 'is', 'over', 'and', 'I', 'must', 'go', 'home'],
      ms: ['Sekolah', 'telah', 'tamat', 'dan', 'saya', 'mahu', 'pulang']
    },
    imageUrl: ''
  },
  {
    id: 's68',
    tokens: {
      zh: ['蜜蜂', '在', '花丛中', '采蜜'],
      en: ['Bees', 'gather', 'honey', 'among', 'the', 'flowers'],
      ms: ['Lebah', 'mengumpul', 'madu', 'di', 'celah', 'bunga']
    },
    imageUrl: ''
  },
  {
    id: 's69',
    tokens: {
      zh: ['这本', '故事书', '非常', '有趣'],
      en: ['This', 'storybook', 'is', 'very', 'interesting'],
      ms: ['Buku', 'cerita', 'ini', 'sangat', 'menarik']
    },
    imageUrl: ''
  },
  {
    id: 's70',
    tokens: {
      zh: ['老师', '教', '我们', '写汉字'],
      en: ['The', 'teacher', 'teaches', 'us', 'Chinese', 'characters'],
      ms: ['Guru', 'mengajar', 'kami', 'menulis', 'tulisan', 'Cina']
    },
    imageUrl: ''
  },
  {
    id: 's71',
    tokens: {
      zh: ['下雨', '了', '要', '撑伞'],
      en: ['It', 'is', 'raining', 'so', 'use', 'an', 'umbrella'],
      ms: ['Hari', 'hujan', 'jadi', 'guna', 'payung']
    },
    imageUrl: ''
  },
  {
    id: 's72',
    tokens: {
      zh: ['小鸟', '在', '天空中', '飞翔'],
      en: ['The', 'little', 'bird', 'is', 'flying', 'in', 'the', 'sky'],
      ms: ['Burung', 'kecil', 'sedang', 'terbang', 'di', 'langit']
    },
    imageUrl: ''
  },
  {
    id: 's73',
    tokens: {
      zh: ['我', '天天', '早起', '刷牙'],
      en: ['I', 'wake', 'up', 'early', 'to', 'brush', 'teeth', 'every', 'day'],
      ms: ['Saya', 'bangun', 'awal', 'gosok', 'gigi', 'setiap', 'hari']
    },
    imageUrl: ''
  },
  {
    id: 's74',
    tokens: {
      zh: ['弟弟', '在', '草地上', '奔跑'],
      en: ['My', 'little', 'brother', 'is', 'running', 'on', 'the', 'grass'],
      ms: ['Adik', 'lelaki', 'sedang', 'berlari', 'di', 'atas', 'padang', 'rumput']
    },
    imageUrl: ''
  },
  {
    id: 's75',
    tokens: {
      zh: ['我们要', '多', '吃', '蔬菜'],
      en: ['We', 'should', 'eat', 'more', 'vegetables'],
      ms: ['Kita', 'perlu', 'makan', 'lebih', 'banyak', 'sayur-sayuran']
    },
    imageUrl: ''
  },
  {
    id: 's76',
    tokens: {
      zh: ['小猫', '喜欢', '睡', '懒觉'],
      en: ['The', 'kitten', 'likes', 'sleeping', 'in', 'late'],
      ms: ['Anak', 'kucing', 'suka', 'tidur', 'lewat']
    },
    imageUrl: ''
  },
  {
    id: 's77',
    tokens: {
      zh: ['今天', '老师', '夸奖了', '我'],
      en: ['Today', 'the', 'teacher', 'praised', 'me'],
      ms: ['Hari', 'ini', 'guru', 'memuji', 'saya']
    },
    imageUrl: ''
  },
  {
    id: 's78',
    tokens: {
      zh: ['妈妈', '做', '的', '饭', '真香'],
      en: ['The', 'food', 'mom', 'makes', 'smells', 'delicious'],
      ms: ['Makanan', 'masakan', 'ibu', 'sangat', 'harum']
    },
    imageUrl: ''
  },
  {
    id: 's79',
    tokens: {
      zh: ['操场', '上', '有', '很多', '人'],
      en: ['There', 'are', 'many', 'people', 'on', 'the', 'playground'],
      ms: ['Terdapat', 'ramai', 'orang', 'di', 'padang', 'permainan']
    },
    imageUrl: ''
  },
  {
    id: 's80',
    tokens: {
      zh: ['小鸭子', '在', '池塘里', '游泳'],
      en: ['Little', 'ducklings', 'are', 'swimming', 'in', 'the', 'pond'],
      ms: ['Anak', 'itik', 'sedang', 'berenang', 'di', 'dalam', 'kolam']
    },
    imageUrl: ''
  },
  {
    id: 's81',
    tokens: {
      zh: ['我们要', '爱护', '花草', '树木'],
      en: ['We', 'must', 'take', 'care', 'of', 'plants', 'and', 'trees'],
      ms: ['Kita', 'mesti', 'menjaga', 'tumbuhan', 'dan', 'pokok']
    },
    imageUrl: ''
  },
  {
    id: 's82',
    tokens: {
      zh: ['外公', '在', '院子里', '种花'],
      en: ['Grandpa', 'is', 'planting', 'flowers', 'in', 'the', 'yard'],
      ms: ['Datuk', 'sedang', 'menanam', 'bunga', 'di', 'dalam', 'halaman']
    },
    imageUrl: ''
  },
  {
    id: 's83',
    tokens: {
      zh: ['我的', '铅笔', '在', '桌子上'],
      en: ['My', 'pencil', 'is', 'on', 'the', 'table'],
      ms: ['Pensil', 'saya', 'ada', 'di', 'atas', 'meja']
    },
    imageUrl: ''
  },
  {
    id: 's84',
    tokens: {
      zh: ['我们', '坐', '校车', '去', '学校'],
      en: ['We', 'take', 'the', 'school', 'bus', 'to', 'school'],
      ms: ['Kami', 'naik', 'bas', 'sekolah', 'ke', 'sekolah']
    },
    imageUrl: ''
  },
  {
    id: 's85',
    tokens: {
      zh: ['天空', '中', '有', '一架', '飞机'],
      en: ['There', 'is', 'an', 'airplane', 'in', 'the', 'sky'],
      ms: ['Terdapat', 'sebuah', 'kapal', 'terbang', 'di', 'langit']
    },
    imageUrl: ''
  },
  {
    id: 's86',
    tokens: {
      zh: ['这只', '兔子', '跳得', '很高'],
      en: ['This', 'rabbit', 'jumps', 'very', 'high'],
      ms: ['Arnab', 'ini', 'melompat', 'sangat', 'tinggi']
    },
    imageUrl: ''
  },
  {
    id: 's87',
    tokens: {
      zh: ['猴子', '最喜欢', '吃', '香蕉'],
      en: ['Monkeys', 'like', 'eating', 'bananas', 'the', 'most'],
      ms: ['Monyet', 'paling', 'suka', 'makan', 'pisang']
    },
    imageUrl: ''
  },
  {
    id: 's88',
    tokens: {
      zh: ['大象', '的', '鼻子', '长长的'],
      en: ['The', 'elephants', 'nose', 'is', 'very', 'long'],
      ms: ['Belalai', 'gajah', 'sangat', 'panjang']
    },
    imageUrl: ''
  },
  {
    id: 's89',
    tokens: {
      zh: ['医生', '治好', '了', '我的', '感冒'],
      en: ['The', 'doctor', 'cured', 'my', 'cold'],
      ms: ['Doktor', 'menyembuhkan', 'selesema', 'saya']
    },
    imageUrl: ''
  },
  {
    id: 's90',
    tokens: {
      zh: ['我们要', '按时', '交', '作业'],
      en: ['We', 'should', 'hand', 'in', 'homework', 'on', 'time'],
      ms: ['Kita', 'patut', 'menghantar', 'kerja', 'sekolah', 'tepat', 'pada', 'masanya']
    },
    imageUrl: ''
  }
];
