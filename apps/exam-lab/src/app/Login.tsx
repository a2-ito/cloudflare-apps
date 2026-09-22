import { GoogleLogin } from "@react-oauth/google";

export function LoginButton() {
  return (
    <GoogleLogin
      onSuccess={async (cred) => {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({ idToken: cred.credential }),
        });

        if (res.ok) {
          location.reload();
        } else {
          alert("アクセス権がありません");
        }
      }}
      onError={() => {
        alert("ログイン失敗");
      }}
    />
  );
}
