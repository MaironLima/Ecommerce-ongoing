import { Search, CircleUser, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { useStore } from "@/stores/store";

function Header() {
  const [valor, setValor] = useState("");

  const { name, accessToken } = useStore.getState();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <header className="bg-primary h-16 w-full flex items-center justify-between text-white text-xl px-4">
      <div>
        <button type="button">
          <img src="/vite.svg" alt="Logo" className="h-10" />
        </button>
        <h1>{name}| 1</h1>
        <h1>{accessToken.length}| 2</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="global-input"
          type="text"
          placeholder="Search here"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button type="submit" className="global-btn" title="Search">
          <Search />
        </button>
      </form>

      <div className="flex items-center gap-2">
        <ModeToggle />

        <div className="flex items-center overflow-hidden rounded">
          <span className="global-btn font-bold flex items-center rounded-none rounded-l">
            3
          </span>
          <button
            type="button"
            title="Cart"
            className="global-btn flex items-center rounded-none rounded-r"
          >
            <ShoppingCart />
          </button>
        </div>
        <button title="Profile" type="button" className="global-btn">
          <CircleUser />
        </button>
      </div>
    </header>
  );
}

export default Header;
