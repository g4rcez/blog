import { assocPath } from "ramda";
import React, { useContext, useMemo, useState } from "react";
import { Body } from "../components/body";
import { Button } from "../components/button/button";
import { Container } from "../components/container";
import { Input } from "../components/input";
import { Paragraph, SubTitle } from "../components/typography";
import { SettingsStore, useDarkMode, useFormatLocaleDate, useLightMode } from "../global/settings.store";

const ColorGrid: React.FC = () => {
    const context = useContext(SettingsStore);
    const colors = context.state.colors;
    const colorsGridArray: { name:string; color: string | {name:string; color: string }[]}[] = useMemo(() => 
        Object.entries(colors).map(
            ([name, color]) => {
                if (typeof color === "object") {
                    return { name, color: Object.entries(color as any).map(([name, c]) => ({ name, color: c }))}
                }
                return ({ name, color })
            })
    , [colors]) as never;

    const changeColor = (path: string[], color: string) => {
        const newColors = assocPath(path, color, colors);
        context.dispatch.setColors(newColors)
    }

    const InputInfo = ({ x, main }: { x: any, main:any }) => {
        const [color, setColor] = useState(x.color);
        return (
                <Input 
                    containerClassName="mt-8"
                    value={color}
                    type="color"
                    onBlur={() => changeColor([main.name, x.name], color)} 
                    onChange={(e: any) => setColor(e.target.value)}
                    placeholder={`${main.name}.${x.name}`} 
                    name={`${main.name}.${x.name}`} 
                />
        );
    }

    return (
        <Container className="grid grid-flow-row-dense md:grid-cols-4 gap-4">
            {colorsGridArray.map((main) => {
                if (Array.isArray(main.color)) {
                    return main.color.map(x => <InputInfo key={`${main.name}${x.name}`} x={x} main={main} />)
                }
                return null
            })}
        </Container>
    );
}

const BlogSettings = () => {
    const context = useContext(SettingsStore);
    const darkMode = useDarkMode();
    const lightMode = useLightMode();
    const dateFormatter = useFormatLocaleDate()
    const [date, setDate] = useState(context.state.locale);

    return (
        <Body className="flex flex-1 flex-col">
            <SubTitle tag="h2" size="text-4xl" className="font-extrabold w-full">Site Settings</SubTitle>
            <Container className="mt-8">
                <SubTitle size="text-2xl" className="font-bold w-full">Date formats</SubTitle> 
                <Input
                    containerClassName="mt-8 w-full md:w-auto"
                    name="locale"
                    placeholder="Locale formatter"
                    value={date} 
                    onChange={(e:any) => setDate(e.target.value)} 
                    onBlur={() => context.dispatch.setLocale(date)} 
                />
                <Paragraph className="w-full">{dateFormatter(new Date().toString())}</Paragraph>
            </Container>
            <Container className="mt-8">
                <Container className="items-center justify-between">
                    <SubTitle size="text-2xl" className="font-bold">Colors Schema</SubTitle> 
                    <div>
                        <Button className="mr-4" onClick={lightMode}>Light Theme</Button>
                        <Button onClick={darkMode}>Dark Theme</Button>
                    </div>
                </Container>
                <ColorGrid />
            </Container>
        </Body>
    )
};


export default BlogSettings