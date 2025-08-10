import { Card, CardContent } from '@/components/ui/card';
import ScrollAnimation from './ScrollAnimation';

export default function About() {
  return (
    <section id="about" className="container py-12 md:py-24 lg:py-32">
      <ScrollAnimation animation="fadeUp">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            About Me
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            不登校から見つけたプログラミングの楽しさを、次世代に伝えたい
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fadeIn" delay={0.2}>
        <div className="mx-auto mt-12 max-w-5xl">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-6 p-0">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  小中学生時代は不登校でしたが、高校でMinecraftのプログラミングに出会い、人生が変わりました。
                  PocketMine-MPプラグイン制作やサーバ運営を通じて、コードを書く楽しさと、
                  それが誰かの笑顔につながる喜びを知りました。
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  現在は北海道情報大学でシステム情報学を学びながら、
                  <span className="font-semibold text-primary"> 未踏IT人材育成事業</span>
                  に採択され、
                  生徒の「好き」を起点にしたプログラミング教育支援システムを開発しています。
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  複数のインターンやハッカソンを通じて実践的なスキルを磨き、
                  100Programでは2チーム同時ファイナリスト・オーディエンス賞最多受賞という成果を残しました。
                  技術を通じて、かつての自分のような子どもたちに、新しい可能性を届けたいと考えています。
                </p>
              </div>

              <ScrollAnimation
                animation="scaleIn"
                stagger={0.1}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              >
                <Card className="text-center p-4">
                  <img
                    src="/pictogram-programming.svg"
                    alt="Programming"
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <h3 className="font-semibold text-sm">Programming</h3>
                  <p className="text-xs text-muted-foreground mt-1">6年以上の経験</p>
                </Card>
                <Card className="text-center p-4">
                  <img
                    src="/pictogram-teaching.svg"
                    alt="Education"
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <h3 className="font-semibold text-sm">Education</h3>
                  <p className="text-xs text-muted-foreground mt-1">プログラミング講師</p>
                </Card>
                <Card className="text-center p-4">
                  <img src="/pictogram-outdoor.svg" alt="登山" className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">登山</h3>
                  <p className="text-xs text-muted-foreground mt-1">北海道の山々</p>
                </Card>
                <Card className="text-center p-4">
                  <img
                    src="/pictogram-rhythm.svg"
                    alt="ベース"
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <h3 className="font-semibold text-sm">ベース</h3>
                  <p className="text-xs text-muted-foreground mt-1">音楽も大好き</p>
                </Card>
              </ScrollAnimation>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>
    </section>
  );
}
