import { Search, CircleUser, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useStore } from "@/stores/store";

function Header() {
  const [valor, setValor] = useState("");
  const navigate = useNavigate();
  const cartItems = useCartStore((s) => s.items);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const cartCount = cartItems.length;
  const accessToken = useStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) void fetchCart();
  }, [accessToken, fetchCart]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onClickIcon = () => {
    navigate("/");
  };

  return (
    <header className="bg-primary h-16 w-full flex items-center justify-between text-white text-xl px-4">
      <div>
        <button onClick={onClickIcon} type="button">
          <img src="/vite.svg" alt="Logo" className="h-10" />
        </button>
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
          {/* <span className="global-btn font-bold flex items-center rounded-none rounded-l">
          </span> */}
          <button
            type="button"
            title="Cart"
            className="global-btn flex items-center rounded-none rounded-r gap-2"
            onClick={() => navigate("/cart")}
            >
            {cartCount}
            <ShoppingCart />
          </button>
        </div>
        <button
          title="My orders"
          type="button"
          className="global-btn"
          onClick={() => navigate("/orders")}
        >
          Orders
        </button>
        <button
          title="Profile"
          type="button"
          className="global-btn"
          onClick={() => navigate("/auth/login")}
        >
          <CircleUser />
        </button>
      </div>
    </header>
  );
}

export default Header;