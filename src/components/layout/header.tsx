import { headerCtas, mainNav } from "@/config/site";
import { Logo } from "./logo";
import { HeaderNav } from "./header-nav";

export function Header() {
  return (
    <>
      {/* backdrop-filter はヘッダー内の fixed 要素（モバイルドロワー）の包含ブロックを作ってしまうため使わない */}
      <header className="border-line bg-paper sticky top-0 z-50 border-b">
        <div className="container-max h-header flex items-center justify-between gap-8">
          <Logo />
          <div className="flex items-center gap-10">
            <HeaderNav items={mainNav} ctas={headerCtas} />
          </div>
        </div>
      </header>
    </>
  );
}
