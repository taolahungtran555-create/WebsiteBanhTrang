import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Bánh Tráng Trộn Ngon Cần Thơ | Ship Tận Nơi Đỉnh Nhất',
  description: 'Thưởng thức bánh tráng trộn chuẩn vị ngon nhất tại Cần Thơ. Menu đa dạng, gia vị đậm đà, nhận ship hàng tận nơi nhanh chóng trong khu vực Ninh Kiều.',
  keywords: 'bánh tráng trộn ngon Cần Thơ, bánh tráng trộn Cần Thơ, ship bánh tráng trộn Cần Thơ, quán bánh tráng trộn Cần Thơ',
  openGraph: {
    title: 'Bánh Tráng Trộn Ngon Cần Thơ | Ship Tận Nơi',
    description: 'Thưởng thức bánh tráng trộn chuẩn vị ngon nhất tại Cần Thơ.',
    url: 'https://banhtrangtronngoncantho.vn',
    siteName: 'Bánh Tráng Trộn Ngon Cần Thơ',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v123456789/thumbnail.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${poppins.variable} min-h-screen flex flex-col`} style={{ fontFamily: 'Inter, sans-serif' }}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        {/* LocalBusiness Schema for Homepage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Bánh Tráng Trộn Ngon Cần Thơ",
              "image": "https://res.cloudinary.com/demo/image/upload/v123456789/logo.png",
              "@id": "https://banhtrangtronngoncantho.vn",
              "url": "https://banhtrangtronngoncantho.vn",
              "telephone": "0123456789",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Đường 30/4",
                "addressLocality": "Quận Ninh Kiều",
                "addressRegion": "Cần Thơ",
                "postalCode": "900000",
                "addressCountry": "VN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 10.0299337,
                "longitude": 105.7706153
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "22:00"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
