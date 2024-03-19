import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Banner from "../../components/Banner/index.jsx";
import currencyFormat from "../../utils/currencyFormat.js";

function CategoryPage() {
  const [items, setItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la catégorie
        const categoriesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        const category = categoriesResponse.data.find((cat) => cat.id === parseInt(categoryId, 10));

        if (category) {
          setCategoryName(category.name);

          // Récupérer les articles aléatoires de la catégorie
          const itemsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/articles/${category.name}/aleatoires`);
          setItems(itemsResponse.data);

          // Récupérer les sous-catégories de la catégorie
          const subcategoriesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${category.name}/sous-categories`);
          setSubcategories(subcategoriesResponse.data);
        } else {
          console.error(`Category with ID ${categoryId} not found.`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [categoryId]);

  return (
    <>
      <h1>{categoryName.toUpperCase()}</h1>

      {/* subcategories */}
      <section>
        <div className="ui three column doubling stackable grid container">
          {subcategories.map((subcategory) => (
            <div key={subcategory.subcategory_id} className="column">
              <Link to={`/sous-categories/${subcategory.subcategory_id}`} state={{ categoryName }}>
                <div className="subcateogry-container" style={{ display: "flex", justifyContent: "center" }}>
                  <img
                  // src={subcategory.subcategory_image}
                    src="https://cdn.discordapp.com/attachments/1206982808489304135/1206982970515132476/Default_category_man_clothes_22.png?ex=65e737fc&is=65d4c2fc&hm=a7ce3c6a530dd5375eabf4d2af312d9164247c329aa7d2ca50a40d6e54e6f6e1&"
                    alt={subcategory.subcategory_name}
                    className="subcategory-image"
                    style={{ width: "60%", height: "auto", borderRadius: "1.2rem" }}
                  />
                  <div className="category-label">
                    <h3>{subcategory.subcategory_name}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Banner />

      {/* items */}
      <section>
        <h2>
          Quelques articles de la catégorie
          {" "}
          {categoryName.toUpperCase()}
        </h2>
        <div className="ui three column doubling stackable grid container">
          {items.map((item) => (
            <div key={item.item_id} className="column">
              <article className="item-preview__container">
                <img
                  src={item.item_picture}
                  alt={item.item_name}
                  className="item-image"
                />
                <aside className="item-preview-info">
                  <h3>{item.item_name}</h3>
                  <p>
                    Prix :
                    {" "}
                    {currencyFormat(item.item_price)}
                  </p>
                  <Link to={`/articles/${item.item_id}`}>
                    <Button primary>Voir</Button>
                  </Link>
                </aside>
              </article>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default CategoryPage;
