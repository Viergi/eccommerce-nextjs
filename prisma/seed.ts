import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Laptop Gaming G-Force 15",
    description:
      "Laptop dengan performa tinggi untuk gaming dan multitasking. Dilengkapi kartu grafis RTX 3060.",
    price: 15000000,
    stock: 50,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Keyboard Mekanikal Pro X",
    description:
      "Keyboard mekanikal dengan switch blue dan lampu RGB. Cocok untuk para gamer dan programmer.",
    price: 850000,
    stock: 120,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Mouse Wireless MX Master 4",
    description:
      "Mouse ergonomis dengan presisi tinggi. Ideal untuk pekerjaan desain grafis dan perkantoran.",
    price: 650000,
    stock: 200,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Monitor Ultra-Wide 27 Inch",
    description:
      "Monitor 27 inci dengan resolusi 4K dan panel IPS. Memberikan warna yang akurat dan detail yang tajam.",
    price: 3500000,
    stock: 75,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Headset Gaming HyperX Cloud Alpha",
    description:
      "Headset gaming dengan kualitas suara superior dan mikrofon yang jernih. Nyaman dipakai dalam waktu lama.",
    price: 1200000,
    stock: 90,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Webcam Full HD Logitech C922",
    description:
      "Webcam dengan resolusi Full HD 1080p. Sempurna untuk streaming, video call, dan meeting online.",
    price: 700000,
    stock: 150,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Hard Drive Eksternal 2TB",
    description:
      "Hard drive eksternal berkapasitas 2TB dengan kecepatan transfer data tinggi. Cocok untuk backup data.",
    price: 950000,
    stock: 180,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "SSD NVMe 1TB Samsung 980 Pro",
    description:
      "SSD internal dengan kecepatan baca dan tulis yang sangat cepat. Meningkatkan performa komputer secara signifikan.",
    price: 2500000,
    stock: 60,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Printer All-in-One Epson L3110",
    description:
      "Printer multifungsi (cetak, scan, copy) dengan sistem infus. Hemat biaya dan mudah digunakan.",
    price: 2200000,
    stock: 45,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Smartwatch FitPro 2",
    description:
      "Smartwatch dengan fitur pemantau detak jantung, langkah, dan notifikasi. Tahan air dan baterai awet.",
    price: 500000,
    stock: 250,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Speaker Bluetooth JBL Flip 6",
    description:
      "Speaker portabel dengan suara powerful dan bass yang dalam. Tahan air dan baterai tahan lama.",
    price: 1300000,
    stock: 110,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Smartphone Galaxy S23",
    description:
      "Smartphone flagship dengan kamera 200MP dan prosesor bertenaga. Desain elegan dan modern.",
    price: 18000000,
    stock: 30,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Tablet Android Tab S8",
    description:
      "Tablet 11 inci dengan layar Super AMOLED. Ideal untuk hiburan dan produktivitas.",
    price: 9000000,
    stock: 40,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Power Bank 20000mAh",
    description:
      "Power bank berkapasitas besar dengan fitur fast charging. Menjaga perangkat Anda tetap menyala.",
    price: 400000,
    stock: 300,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Wireless Charger Stand",
    description:
      "Charger nirkabel untuk smartphone. Praktis dan mudah digunakan, cocok untuk meja kerja.",
    price: 250000,
    stock: 175,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Router Wi-Fi 6 AX5400",
    description:
      "Router generasi terbaru dengan kecepatan super cepat dan jangkauan luas. Cocok untuk smart home.",
    price: 1800000,
    stock: 55,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Stabilizer Gimbal DJI OM 5",
    description:
      "Stabilizer untuk smartphone. Menghasilkan rekaman video yang halus dan profesional.",
    price: 2800000,
    stock: 35,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Drone DJI Mini 3 Pro",
    description:
      "Drone dengan kamera 4K dan desain lipat. Ringan dan mudah dibawa bepergian.",
    price: 11000000,
    stock: 20,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Kamera Mirrorless Sony Alpha A7 III",
    description:
      "Kamera full-frame profesional. Menghasilkan foto dan video berkualitas tinggi.",
    price: 25000000,
    stock: 15,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Lensa Kamera Canon EF 50mm f/1.8",
    description:
      "Lensa fix 50mm dengan bukaan lebar. Ideal untuk potret dan low-light photography.",
    price: 1500000,
    stock: 80,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Dompet Kulit Asli",
    description:
      "Dompet pria berbahan kulit asli dengan banyak slot kartu. Desain klasik dan elegan.",
    price: 300000,
    stock: 120,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Sabuk Kulit Pria",
    description:
      "Sabuk pria berbahan kulit asli dengan buckle metal. Tahan lama dan stylish.",
    price: 250000,
    stock: 110,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Kaos Polos Cotton Combed",
    description:
      "Kaos polos berbahan katun combed 30s. Nyaman dan adem dipakai sehari-hari.",
    price: 70000,
    stock: 400,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Celana Jeans Pria Slim Fit",
    description:
      "Celana jeans dengan potongan slim fit. Memberikan penampilan modern dan rapi.",
    price: 350000,
    stock: 80,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Parfum Pria Eclat",
    description:
      "Parfum pria dengan aroma maskulin yang tahan lama. Cocok untuk acara formal dan santai.",
    price: 400000,
    stock: 95,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Parfum Wanita Zara",
    description:
      "Parfum wanita dengan aroma floral yang segar. Memberikan kesan elegan dan feminim.",
    price: 380000,
    stock: 105,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Pembersih Wajah Pria",
    description:
      "Pembersih wajah khusus pria. Mengangkat kotoran dan minyak berlebih tanpa membuat kulit kering.",
    price: 90000,
    stock: 150,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Serum Wajah Vitamin C",
    description:
      "Serum dengan kandungan vitamin C. Mencerahkan kulit dan mengurangi flek hitam.",
    price: 120000,
    stock: 200,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Pelembap Wajah Hyaluronic Acid",
    description:
      "Pelembap wajah dengan kandungan hyaluronic acid. Menghidrasi kulit dan menjaganya tetap kenyal.",
    price: 100000,
    stock: 180,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Sunscreen SPF 50",
    description:
      "Sunscreen dengan SPF 50. Melindungi kulit dari sinar UV dan radikal bebas.",
    price: 85000,
    stock: 250,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Lipstick Matte Wardah",
    description:
      "Lipstick matte dengan warna-warna natural. Tahan lama dan tidak membuat bibir kering.",
    price: 60000,
    stock: 300,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Eyeshadow Palette Nude",
    description:
      "Eyeshadow palette dengan 12 warna nude. Cocok untuk makeup sehari-hari atau acara spesial.",
    price: 150000,
    stock: 130,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Foundation Matte Maybelline",
    description:
      "Foundation dengan hasil matte dan coverage tinggi. Tahan lama hingga 24 jam.",
    price: 180000,
    stock: 110,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Blush On Cream",
    description:
      "Blush on berbentuk cream dengan warna natural. Memberikan rona pipi yang sehat dan segar.",
    price: 75000,
    stock: 160,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Eyeliner Cair Tahan Air",
    description:
      "Eyeliner cair dengan formula tahan air. Menghasilkan garis yang presisi dan tahan lama.",
    price: 50000,
    stock: 220,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Maskara Volumizing",
    description:
      "Maskara yang memberikan volume dan panjang pada bulu mata. Tahan lama dan tidak menggumpal.",
    price: 80000,
    stock: 190,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Cermin Rias LED",
    description:
      "Cermin rias dengan lampu LED. Memudahkan saat berdandan dan merias wajah.",
    price: 200000,
    stock: 100,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Hair Dryer Philips BHD004",
    description:
      "Hair dryer dengan 3 pengaturan panas dan kecepatan. Mengeringkan rambut dengan cepat.",
    price: 300000,
    stock: 70,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Catokan Rambut Lurus",
    description:
      "Alat catok rambut dengan teknologi ceramic. Meluruskan rambut tanpa merusak.",
    price: 250000,
    stock: 85,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Shampo Anti Ketombe",
    description:
      "Shampo dengan formula anti ketombe. Membersihkan kulit kepala dan mengurangi gatal.",
    price: 60000,
    stock: 250,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Gorden Jendela Minimalis",
    description:
      "Gorden dengan desain minimalis. Melengkapi dekorasi ruangan dan menghalangi cahaya matahari.",
    price: 150000,
    stock: 220,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Karpet Bulu Abu-abu",
    description:
      "Karpet bulu dengan warna abu-abu. Memberikan sentuhan hangat dan elegan pada ruangan.",
    price: 400000,
    stock: 85,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Rak Buku Minimalis",
    description:
      "Rak buku 4 tingkat dengan desain minimalis. Cocok untuk menyimpan buku dan barang dekorasi.",
    price: 500000,
    stock: 70,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Meja Kerja Minimalis",
    description:
      "Meja kerja dengan desain simpel dan modern. Cocok untuk kamar tidur atau ruang kerja.",
    price: 800000,
    stock: 50,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Kursi Gaming Ergonomis",
    description:
      "Kursi gaming dengan sandaran yang bisa diatur. Memberikan kenyamanan saat bermain game.",
    price: 1500000,
    stock: 45,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Sepeda Lipat Polygon",
    description:
      "Sepeda lipat 20 inci dengan 7 kecepatan. Ringan dan mudah dibawa kemana saja.",
    price: 3000000,
    stock: 30,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Helm Sepeda Cairbull",
    description:
      "Helm sepeda ringan dan aerodinamis. Memberikan perlindungan maksimal saat bersepeda.",
    price: 450000,
    stock: 90,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Pompa Sepeda Mini",
    description:
      "Pompa sepeda portabel yang ringkas dan mudah dibawa. Ideal untuk bersepeda jarak jauh.",
    price: 100000,
    stock: 150,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Sarung Tangan Sepeda Gel",
    description:
      "Sarung tangan sepeda dengan bantalan gel. Mengurangi getaran dan memberikan cengkeraman lebih baik.",
    price: 80000,
    stock: 200,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Alat Fitness Tali Skipping",
    description:
      "Tali skipping dengan bantalan dan pegangan yang nyaman. Cocok untuk latihan kardio.",
    price: 75000,
    stock: 300,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Matras Yoga Non-Slip",
    description:
      "Matras yoga dengan permukaan anti-slip. Memberikan stabilitas saat melakukan pose yoga.",
    price: 200000,
    stock: 180,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Dumbbell Set 10kg",
    description:
      "Set dumbbell dengan berat 10kg. Cocok untuk latihan beban di rumah.",
    price: 350000,
    stock: 100,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Botol Minum Plastik 1L",
    description:
      "Botol minum plastik BPA-free dengan kapasitas 1 liter. Menjaga tubuh tetap terhidrasi.",
    price: 50000,
    stock: 500,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Tas Selempang Pria",
    description:
      "Tas selempang kecil dengan bahan kanvas. Cocok untuk menyimpan dompet, kunci, dan HP.",
    price: 180000,
    stock: 150,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Dompet Kulit Asli",
    description:
      "Dompet pria berbahan kulit asli dengan banyak slot kartu. Desain klasik dan elegan.",
    price: 300000,
    stock: 120,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Sabuk Kulit Pria",
    description:
      "Sabuk pria berbahan kulit asli dengan buckle metal. Tahan lama dan stylish.",
    price: 250000,
    stock: 110,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Kaos Polos Cotton Combed",
    description:
      "Kaos polos berbahan katun combed 30s. Nyaman dan adem dipakai sehari-hari.",
    price: 70000,
    stock: 400,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Celana Jeans Pria Slim Fit",
    description:
      "Celana jeans dengan potongan slim fit. Memberikan penampilan modern dan rapi.",
    price: 350000,
    stock: 80,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Parfum Pria Eclat",
    description:
      "Parfum pria dengan aroma maskulin yang tahan lama. Cocok untuk acara formal dan santai.",
    price: 400000,
    stock: 95,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Parfum Wanita Zara",
    description:
      "Parfum wanita dengan aroma floral yang segar. Memberikan kesan elegan dan feminim.",
    price: 380000,
    stock: 105,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Pembersih Wajah Pria",
    description:
      "Pembersih wajah khusus pria. Mengangkat kotoran dan minyak berlebih tanpa membuat kulit kering.",
    price: 90000,
    stock: 150,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Serum Wajah Vitamin C",
    description:
      "Serum dengan kandungan vitamin C. Mencerahkan kulit dan mengurangi flek hitam.",
    price: 120000,
    stock: 200,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Pelembap Wajah Hyaluronic Acid",
    description:
      "Pelembap wajah dengan kandungan hyaluronic acid. Menghidrasi kulit dan menjaganya tetap kenyal.",
    price: 100000,
    stock: 180,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Sunscreen SPF 50",
    description:
      "Sunscreen dengan SPF 50. Melindungi kulit dari sinar UV dan radikal bebas.",
    price: 85000,
    stock: 250,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Lipstick Matte Wardah",
    description:
      "Lipstick matte dengan warna-warna natural. Tahan lama dan tidak membuat bibir kering.",
    price: 60000,
    stock: 300,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Eyeshadow Palette Nude",
    description:
      "Eyeshadow palette dengan 12 warna nude. Cocok untuk makeup sehari-hari atau acara spesial.",
    price: 150000,
    stock: 130,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Foundation Matte Maybelline",
    description:
      "Foundation dengan hasil matte dan coverage tinggi. Tahan lama hingga 24 jam.",
    price: 180000,
    stock: 110,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Blush On Cream",
    description:
      "Blush on berbentuk cream dengan warna natural. Memberikan rona pipi yang sehat dan segar.",
    price: 75000,
    stock: 160,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Eyeliner Cair Tahan Air",
    description:
      "Eyeliner cair dengan formula tahan air. Menghasilkan garis yang presisi dan tahan lama.",
    price: 50000,
    stock: 220,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Maskara Volumizing",
    description:
      "Maskara yang memberikan volume dan panjang pada bulu mata. Tahan lama dan tidak menggumpal.",
    price: 80000,
    stock: 190,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Cermin Rias LED",
    description:
      "Cermin rias dengan lampu LED. Memudahkan saat berdandan dan merias wajah.",
    price: 200000,
    stock: 100,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Hair Dryer Philips BHD004",
    description:
      "Hair dryer dengan 3 pengaturan panas dan kecepatan. Mengeringkan rambut dengan cepat.",
    price: 300000,
    stock: 70,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Catokan Rambut Lurus",
    description:
      "Alat catok rambut dengan teknologi ceramic. Meluruskan rambut tanpa merusak.",
    price: 250000,
    stock: 85,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Shampo Anti Ketombe",
    description:
      "Shampo dengan formula anti ketombe. Membersihkan kulit kepala dan mengurangi gatal.",
    price: 60000,
    stock: 250,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Conditioner Rambut Kering",
    description:
      "Conditioner untuk rambut kering dan rusak. Melembapkan dan melembutkan rambut.",
    price: 65000,
    stock: 230,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Vitamin Rambut Ellips",
    description:
      "Vitamin rambut dalam bentuk kapsul. Memberikan nutrisi dan kilau pada rambut.",
    price: 35000,
    stock: 400,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Troli Belanja Lipat",
    description:
      "Troli belanja lipat dengan roda. Memudahkan saat berbelanja di pasar atau supermarket.",
    price: 150000,
    stock: 120,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Kotak Penyimpanan Makanan",
    description:
      "Set kotak penyimpanan makanan plastik BPA-free. Aman untuk microwave dan kulkas.",
    price: 80000,
    stock: 300,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Botol Minum Anak",
    description:
      "Botol minum dengan desain karakter lucu. Kapasitas 500ml dan dilengkapi sedotan.",
    price: 45000,
    stock: 250,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    name: "Kotak Pensil Sekolah",
    description:
      "Kotak pensil dengan 2 resleting. Cocok untuk anak sekolah menyimpan alat tulis.",
    price: 30000,
    stock: 350,
    categoryId: 1,
    status: "publish",
    imageUrl: "https://placehold.co/600x400",
  },
];

const categories = [
  {
    name: "Pakaian Pria",
    description: "Koleksi pakaian pria, mulai dari kasual hingga formal.",
  },
  {
    name: "Pakaian Wanita",
    description: "Fashion wanita terbaru, termasuk gaun, atasan, dan celana.",
  },
  {
    name: "Perlengkapan Rumah Tangga",
    description:
      "Semua yang Anda butuhkan untuk mempercantik dan melengkapi rumah.",
  },
  {
    name: "Kecantikan & Perawatan Diri",
    description: "Produk makeup, skincare, dan perawatan tubuh lengkap.",
  },
  {
    name: "Alat Olahraga",
    description: "Peralatan untuk berbagai jenis olahraga dan aktivitas fisik.",
  },
  {
    name: "Hobi & Koleksi",
    description:
      "Barang-barang unik untuk hobi seperti model kit, action figure, dan lainnya.",
  },
  {
    name: "Otomotif",
    description: "Suku cadang dan aksesori untuk mobil dan motor.",
  },
  {
    name: "Bayi & Anak-anak",
    description:
      "Kebutuhan lengkap untuk bayi dan anak-anak, dari pakaian hingga mainan.",
  },
  {
    name: "Buku & Alat Tulis",
    description:
      "Buku fiksi, non-fiksi, dan perlengkapan untuk sekolah atau kantor.",
  },
  {
    name: "Makanan & Minuman",
    description:
      "Berbagai produk makanan dan minuman siap saji, camilan, dan bahan pokok.",
  },
  {
    name: "Hewan Peliharaan",
    description:
      "Makanan, mainan, dan perlengkapan untuk hewan kesayangan Anda.",
  },
  {
    name: "Kerajinan Tangan",
    description: "Produk buatan tangan unik dan artistik dari pengrajin lokal.",
  },
  {
    name: "Kesehatan",
    description:
      "Suplemen, vitamin, dan alat-alat kesehatan untuk menjaga tubuh tetap fit.",
  },
  {
    name: "Mainan & Permainan",
    description: "Aneka mainan edukatif dan permainan seru untuk segala usia.",
  },
  {
    name: "Alat Musik",
    description: "Instrumen musik modern dan tradisional, serta aksesoris.",
  },
  {
    name: "Perhiasan & Aksesori",
    description: "Koleksi perhiasan, jam tangan, dan aksesori fashion.",
  },
  {
    name: "Perlengkapan Dapur",
    description:
      "Alat masak, peralatan makan, dan perlengkapan untuk dapur modern.",
  },
  {
    name: "Perlengkapan Kebun",
    description: "Alat dan bahan untuk berkebun, dari pupuk hingga pot.",
  },
  {
    name: "Peralatan Kantor",
    description: "Meja, kursi, dan perlengkapan lain untuk kebutuhan kantor.",
  },
  {
    name: "Tas & Koper",
    description: "Tas ransel, tas selempang, dan koper untuk traveling.",
  },
  {
    name: "Peralatan Fotografi",
    description: "Kamera, lensa, dan aksesoris untuk para fotografer.",
  },
  {
    name: "Perlengkapan Outdoor",
    description:
      "Tenda, sleeping bag, dan peralatan untuk mendaki atau camping.",
  },
  {
    name: "Bahan Bangunan",
    description:
      "Material dan alat untuk proyek konstruksi dan renovasi rumah.",
  },
  {
    name: "Keramik & Kaca",
    description: "Produk keramik, vas, dan dekorasi berbahan kaca.",
  },
  {
    name: "Produk Digital",
    description: "E-book, software, dan layanan digital lainnya.",
  },
  {
    name: "Peralatan Gaming",
    description: "Konsol, game, dan aksesoris untuk pengalaman gaming terbaik.",
  },
  {
    name: "Furniture",
    description: "Perabotan rumah tangga, seperti sofa, meja, dan lemari.",
  },
  {
    name: "Perlengkapan Pesta",
    description: "Dekorasi, balon, dan perlengkapan untuk acara spesial.",
  },
  {
    name: "Alat Musik Tradisional",
    description: "Alat musik khas daerah dari seluruh Indonesia.",
  },
  {
    name: "Pakaian Adat",
    description: "Baju tradisional dan aksesoris dari berbagai suku.",
  },
  {
    name: "Mainan Edukasi",
    description: "Mainan yang dirancang untuk merangsang perkembangan anak.",
  },
  {
    name: "Aksesori Smartphone",
    description: "Case, charger, dan earphone untuk melengkapi ponsel Anda.",
  },
  {
    name: "Alat Kebersihan",
    description: "Peralatan dan produk untuk membersihkan rumah.",
  },
  {
    name: "Tanaman Hias",
    description: "Berbagai jenis tanaman indoor dan outdoor untuk dekorasi.",
  },
  {
    name: "Bumbu & Rempah",
    description: "Bumbu dapur kering dan rempah-rempah asli.",
  },
  {
    name: "Frozen Food",
    description: "Makanan beku praktis untuk persediaan di rumah.",
  },
  {
    name: "Minuman Kemasan",
    description: "Minuman ringan, jus, dan teh dalam kemasan praktis.",
  },
  {
    name: "Kue & Pastry",
    description: "Berbagai kue kering, basah, dan pastry lezat.",
  },
  {
    name: "Susu & Produk Olahan",
    description: "Susu, keju, yogurt, dan produk olahan susu lainnya.",
  },
  {
    name: "Perlengkapan Mandi",
    description: "Sabun, sampo, dan produk-produk untuk kamar mandi.",
  },
  {
    name: "Alat Cukur",
    description: "Pisau cukur, krim, dan aksesoris perawatan jenggot.",
  },
  {
    name: "Parfum & Cologne",
    description: "Koleksi wewangian untuk pria dan wanita.",
  },
  {
    name: "Perawatan Rambut",
    description: "Produk perawatan rambut, mulai dari sampo hingga serum.",
  },
  {
    name: "Perawatan Kuku",
    description: "Kutek, alat manicure, dan produk perawatan kuku lainnya.",
  },
  {
    name: "Perhiasan Imitasi",
    description: "Perhiasan fashion dengan harga terjangkau.",
  },
  {
    name: "Jam Tangan",
    description: "Jam tangan analog dan digital dari berbagai merek.",
  },
  {
    name: "Topi & Penutup Kepala",
    description: "Topi, kupluk, dan aksesoris untuk kepala.",
  },
  {
    name: "Syal & Selendang",
    description: "Syal dan selendang dengan beragam motif dan bahan.",
  },
  {
    name: "Jaket & Mantel",
    description: "Jaket hangat dan mantel stylish untuk cuaca dingin.",
  },
  {
    name: "Celana Jeans",
    description: "Celana jeans dengan model slim fit, regular, dan wide leg.",
  },
  {
    name: "Sepatu Lari",
    description: "Sepatu khusus untuk lari dengan teknologi bantalan terbaru.",
  },
  {
    name: "Sepatu Formal",
    description: "Sepatu pantofel dan sepatu hak tinggi untuk acara resmi.",
  },
  {
    name: "Peralatan Camping",
    description: "Tenda, kompor portable, dan perlengkapan untuk berkemah.",
  },
  {
    name: "Peralatan Memancing",
    description: "Joran, umpan, dan perlengkapan lain untuk hobi memancing.",
  },
  {
    name: "Alat Masak",
    description:
      "Panci, wajan, dan spatula untuk kebutuhan memasak sehari-hari.",
  },
  {
    name: "Peralatan Makan",
    description: "Piring, sendok, garpu, dan set makan lainnya.",
  },
  {
    name: "Dekorasi Dinding",
    description: "Lukisan, bingkai foto, dan hiasan untuk dinding.",
  },
  {
    name: "Lampu & Pencahayaan",
    description: "Lampu gantung, lampu meja, dan bohlam LED.",
  },
  {
    name: "Alat Pertukangan",
    description: "Bor, gergaji, dan kunci pas untuk proyek perbaikan rumah.",
  },
  {
    name: "Alat Jahit",
    description: "Mesin jahit, benang, dan perlengkapan menjahit lainnya.",
  },
  {
    name: "Perlengkapan Pesta Anak",
    description: "Dekorasi dan perlengkapan pesta dengan tema anak-anak.",
  },
  {
    name: "Perlengkapan Pesta Pernikahan",
    description: "Dekorasi dan suvenir untuk acara pernikahan.",
  },
  {
    name: "Souvenir",
    description: "Hadiah kecil dan suvenir untuk berbagai acara.",
  },
  {
    name: "Kerudung & Hijab",
    description: "Koleksi hijab dengan berbagai model dan bahan.",
  },
  {
    name: "Mukena",
    description: "Peralatan sholat mukena dengan beragam motif.",
  },
  {
    name: "Baju Muslim Pria",
    description: "Kemeja koko, sarung, dan perlengkapan sholat pria.",
  },
  {
    name: "Pakaian Renang",
    description: "Baju renang untuk dewasa dan anak-anak.",
  },
  {
    name: "Alat Pijat",
    description: "Alat pijat elektrik dan manual untuk relaksasi tubuh.",
  },
  {
    name: "Obat-obatan Herbal",
    description: "Obat-obatan alami dan jamu tradisional.",
  },
  {
    name: "Aromaterapi",
    description: "Minyak esensial, diffuser, dan lilin aromaterapi.",
  },
  {
    name: "Camilan Sehat",
    description: "Berbagai camilan rendah kalori dan bebas gluten.",
  },
  {
    name: "Kopi & Teh",
    description: "Biji kopi, bubuk kopi, dan berbagai jenis teh.",
  },
  {
    name: "Peralatan Kebersihan Mobil",
    description: "Sampo mobil, wax, dan lap microfiber.",
  },
  {
    name: "Aksesori Sepeda Motor",
    description: "Helm, jaket, sarung tangan, dan perlengkapan touring.",
  },
  {
    name: "Perlengkapan Bayi Baru Lahir",
    description:
      "Kebutuhan esensial untuk newborn, dari popok hingga botol susu.",
  },
  {
    name: "Mainan Kayu",
    description: "Mainan tradisional dari bahan kayu yang aman untuk anak.",
  },
  {
    name: "Peralatan Menggambar",
    description: "Pensil warna, krayon, dan cat air untuk anak-anak.",
  },
  {
    name: "Pakaian Tidur",
    description: "Piyama dan baju tidur yang nyaman.",
  },
  {
    name: "Handuk & Keset",
    description: "Handuk mandi, handuk wajah, dan keset rumah.",
  },
  {
    name: "Perlengkapan Mandi Bayi",
    description: "Sabun, sampo, dan baby oil khusus untuk bayi.",
  },
  {
    name: "Buku Masak",
    description: "Koleksi resep masakan dari berbagai negara.",
  },
  {
    name: "Taman & Lanskap",
    description: "Alat potong rumput, bibit pohon, dan dekorasi taman.",
  },
  {
    name: "Peralatan Seni",
    description: "Kanvas, cat akrilik, dan kuas untuk melukis.",
  },
  {
    name: "Model Kit",
    description: "Model kit pesawat, mobil, dan robot.",
  },
  {
    name: "Kamera Instan",
    description: "Kamera polaroid dan film instan.",
  },
  {
    name: "Aksesori Kamera",
    description: "Tas kamera, tripod, dan strap kamera.",
  },
  {
    name: "Koleksi Vinyl",
    description: "Piringan hitam dan turntable untuk penggemar musik vintage.",
  },
  {
    name: "Alat Musik Gitar",
    description: "Gitar akustik, elektrik, dan aksesoris.",
  },
  {
    name: "Peralatan Drum",
    description: "Drum set, cymbal, dan stick drum.",
  },
  {
    name: "Buku Pengembangan Diri",
    description: "Buku motivasi dan pengembangan soft skill.",
  },
  {
    name: "Buku Sejarah",
    description: "Buku sejarah dunia, sejarah Indonesia, dan biografi.",
  },
  {
    name: "Snack Import",
    description: "Berbagai camilan unik dari luar negeri.",
  },
  {
    name: "Kopi Instan",
    description: "Aneka varian kopi bubuk siap seduh.",
  },
  {
    name: "Teh Herbal",
    description: "Teh dari bahan-bahan alami untuk kesehatan.",
  },
  {
    name: "Bumbu Instan",
    description: "Bumbu siap pakai untuk memasak dengan cepat.",
  },
  {
    name: "Lampu Tidur",
    description: "Lampu dengan cahaya redup untuk menemani tidur.",
  },
  {
    name: "Karpet",
    description: "Karpet dengan berbagai ukuran dan motif.",
  },
  {
    name: "Gorden",
    description: "Gorden jendela dengan desain minimalis hingga mewah.",
  },
  {
    name: "Alat Pel",
    description: "Alat pel lantai otomatis dan manual.",
  },
  {
    name: "Pengharum Ruangan",
    description: "Pengharum ruangan dengan beragam aroma.",
  },
  {
    name: "Peralatan Cuci Mobil",
    description: "Ember, spons, dan lap microfiber untuk cuci mobil.",
  },
  {
    name: "Helm Sepeda",
    description: "Helm sepeda dengan desain sporty.",
  },
  {
    name: "Sepeda Gunung",
    description: "Sepeda gunung dengan suspensi ganda.",
  },
  {
    name: "Perlengkapan Tenis",
    description: "Raket, bola, dan tas tenis.",
  },
  {
    name: "Baju Renang Muslimah",
    description: "Baju renang yang syar'i dan nyaman.",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  // for (const p of products) {
  //   const product = await prisma.product.create({
  //     data: p, // Cukup berikan objek produk tanpa id
  //   });
  //   console.log(`Created product with id: ${product.id}`);
  // }
  for (const c of categories) {
    const category = await prisma.category.create({
      data: c, // Cukup berikan objek produk tanpa id
    });
    console.log(`Created category with id: ${category.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
