export const ProgressTopBar = (
  { id = "top-bar", classes = [], start = 0, color= "blue"} = {
    id: "top-bar",
    classes: [],
    start: 0,
    color: "blue"
  }
) => {
  const bar = document.createElement("div");
  bar.id = id;
  bar.classList.add("transition", "rounded", "bg-top-bar", "glow", ...classes);
  bar.style.position = "fixed";
  bar.style.top = "0";
  bar.style.height = "2px";
  bar.style.backgroundColor = color;
  let incCounter = 1;
  const controls = {
    start: (percent?: string) => {
      bar.style.width = `${percent ?? start}%`;
      document.body.appendChild(bar);
      return controls;
    },
    set: (percent: string) => {
      bar.style.width = `${percent}%`;
      return controls;
    },
    done: () => {
      bar.style.width = `100%`;
      setTimeout(() => {
        bar.style.opacity = "0";
        document.body.removeChild(bar);
      }, 650);
    },
    increment: () => {
      const [number] = bar.style.width.split("%");
      const n = Number.parseFloat(number);
      const w = n + n * 0.45;
      let minValue = Math.min(w, 97);
      if (minValue === 97) {
        minValue += incCounter / 10;
      }
      incCounter += 1;
      bar.style.width = `${minValue}%`;
      return controls;
    }
  };
  return controls;
};
