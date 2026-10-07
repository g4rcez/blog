import { permanentRedirect } from "next/navigation";

export default function Page(): never {
    permanentRedirect("/tags");
}
