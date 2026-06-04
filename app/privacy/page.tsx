export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <a
        href="/"
        className="inline-block mb-6 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        ← Vibe Class 🐙 돌아가기
      </a>
      
      <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

      <p className="mb-8">
        바이브클래스(이하 "본 서비스")는 개인정보 보호법 제30조에 따라
        이용자의 개인정보를 보호하고 관련 고충을 처리하기 위하여 다음과 같이
        개인정보처리방침을 수립·공개합니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제1조(개인정보의 처리 목적)
      </h2>
      <p>
        본 서비스는 회원가입, 로그인, 게시글 작성, 문의 접수 등의 기능을
        제공하지 않으며 이용자의 개인정보를 직접 수집하거나 이용하지
        않습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제2조(처리하는 개인정보 항목)
      </h2>
      <p>
        본 서비스는 이용자의 이름, 연락처, 이메일 주소, 학번, 학습기록 등
        개인정보를 수집하거나 저장하지 않습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제3조(개인정보의 보유 및 이용기간)
      </h2>
      <p>
        본 서비스는 개인정보를 수집하지 않으므로 별도의 개인정보 보유 및
        이용기간이 없습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제4조(개인정보의 제3자 제공)
      </h2>
      <p>
        본 서비스는 개인정보를 수집하지 않으므로 개인정보를 제3자에게
        제공하지 않습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제5조(개인정보 처리업무의 위탁)
      </h2>
      <p>
        본 서비스는 서비스 제공을 위하여 Vercel Inc.의 호스팅 서비스를
        이용하고 있습니다. 서비스 운영 과정에서 접속 기록 등 최소한의 기술적
        정보가 호스팅 사업자에 의해 처리될 수 있습니다.
      </p>

      <p className="mt-3">
        수탁업체: Vercel Inc.
        <br />
        위탁업무: 웹사이트 호스팅 및 서버 운영
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제6조(정보주체의 권리·의무)
      </h2>
      <p>
        이용자는 개인정보 보호 관련 법령에 따른 권리를 행사할 수 있습니다.
        다만 본 서비스는 개인정보를 직접 수집·보유하지 않습니다.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제7조(개인정보 보호책임자)
      </h2>
      <p>
        성명: 제수연
        <br />
        직위: 서비스 운영자
        <br />
        연락처: wptnwptn@sen.go.kr
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">
        제8조(개인정보처리방침의 변경)
      </h2>
      <p>본 개인정보처리방침은 2026년 6월 1일부터 적용됩니다.</p>
    </main>
  );
}
