import style from "@/app/CardPage/Card.module.css";
import { useAuth } from "@/app/Context/Context";

export default function Card({ product }) {
  const { setProductBuy, addedItems, setAddedItems } = useAuth();


  const handleAddToCart = (item) => {
    setProductBuy((prev) => {
      const product = prev.find((p) => p.id === item.id);

      if (product) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, pro: p.pro + 1 } : p,
        );
      }

      return [...prev, { ...item, pro: 1 }];
    });
    setAddedItems((prev) =>
      prev.includes(item.id) ? prev : [...prev, item.id],
    );
  };
  return (
    <div className={style.bodyCard}>
      <section className={style.Card}>
        {product.map((item, index) => (
          <div className={style.serviceCard} key={index}>
            <img
              className={style.serviceImage}
              src={item.image}
              alt={item.title}
            />
            <p className={style.serviceTitle}>{item.title}</p>
            <h2 className={style.serviceDescription}>{item.description}</h2>
            <p className={style.servicePrice}>
              {parseInt(item.price)?.toLocaleString("fa-IR")} تومان
            </p>
            <button
                  className={`${style.serviceBtn} ${addedItems.includes(item.id) ? style.serviceBtnGreen : ""}`}
                  onClick={() => handleAddToCart(item)}
                  disabled={addedItems.includes(item.id)}
                >
                  {addedItems.includes(item.id) ? (
                    <>
                      به سبد خرید اضافه شد
                      <svg
                        className={style.svg}
                        viewBox="0 0 24 24"
                        fill="white"
                        width="18"
                        height="18"
                        style={{ marginLeft: "8px" }}
                      >
                        <path d="M20.656 2.993L10.007 13.642l-3.471-3.471a.995.995 0 0 0-1.403 1.403l4.173 4.173a.994.994 0 0 0 1.403 0l11.355-11.355a.995.995 0 0 0-1.403-1.403z" />
                      </svg>
                    </>
                  ) : (
                    "افزودن به سبد خرید"
                  )}
                </button>
          </div>
        ))}
      </section>
    </div>
  );
}
