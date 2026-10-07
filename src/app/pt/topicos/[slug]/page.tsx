import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props): Promise<never> {
    const { slug } = await params;
    permanentRedirect(`/pt/tags/${encodeURIComponent(slug)}`);
}
