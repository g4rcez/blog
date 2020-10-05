import { assocPath } from "ramda";
import React, { useContext, useMemo, useState } from "react";
import { Body } from "../components/body";
import { Container } from "../components/container";
import { Input } from "../components/input";
import { Paragraph, SubTitle } from "../components/typography";
import { SettingsStore, useFormatLocaleDate } from "../global/settings.store";

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

    const InputInfo = ({x, main}: any) => {
        const [color, setColor] = useState(x.color);
        return (
            <div className="w-full flex items-center justify-between mt-8">
                <Input 
                    containerClassName="w-11/12"
                    value={color}
                    onBlur={() => changeColor([main.name, x.name], color)} 
                    onChange={(e) => setColor(e.target.value)} 
                    placeholder={`${main.name}.${x.name}`} 
                    name={`${main.name}.${x.name}`} 
                />
                <svg width="16" height="16">
                    <rect x="0" y="0" width="16" height="16" style={{ fill: color, strokeWidth: "1px", stroke: "white" }} />
                </svg>
            </div>
        );
    }

    return (
        <Container className="grid grid-flow-row-dense grid-cols-4 gap-4">
            {colorsGridArray.map((main) => {
                if (Array.isArray(main.color)) {
                    return main.color.map(x => <InputInfo x={x} main={main} />)
                }
                return <InputInfo x={main} main={main} />
            })}
        </Container>
    );
}

const BlogSettings = () => {
    const settings = useContext(SettingsStore);
    
    const dateFormatter = useFormatLocaleDate()
    const [date, setDate] = useState(settings.state.locale);

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
                    onChange={(e) => setDate(e.target.value)} 
                    onBlur={() => settings.dispatch.setLocale(date)} 
                />
                <Paragraph className="w-full">{dateFormatter(new Date().toString())}</Paragraph>
            </Container>
            <Container className="mt-8">
                <SubTitle size="text-2xl" className="font-bold w-full">Colors Schema</SubTitle> 
                <ColorGrid />
            </Container>
        </Body>
    )
};


export default BlogSettings