import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import currencyFormat from "../../utils/helpers.js";
import "./creatoritems.scss";

function CreatorItems() {
  const [creatorArticles, setCreatorArticles] = useState([]);
  const workshopId = localStorage.getItem("workshopId");
  useEffect(() => {
    const fetchCreatorArticles = async () => {
      try {
        // Appel API pour récupérer les articles du créateur
        const articlesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/articles/createurs/${workshopId}`);
        setCreatorArticles(articlesResponse.data);
      } catch (error) {
        console.error("Error fetching creator articles:", error);
      }
    };

    fetchCreatorArticles();
  }, [workshopId]);

  return (
    <div className="ui three column doubling stackable grid container">
      {/* Bouton "Créer un article" */}
      <div className="column">
        <div className="item-preview__container">
          <div className="item-preview-info">
            <Link to="/ajout-article">
              <button type="button" className="ui inverted green button">
                <i className="plus icon" />
                Créer un article
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Liste des articles existants */}
      {creatorArticles.map((item) => (
        <div key={item.item_id} className="column">
          <article className="item-preview__container">
            <img
              src={item.item_picture}
              alt={item.item_name}
              className="item-image"
            />
            <aside className="item-preview-info">
              <h3>{item.item_name}</h3>
              <p>{item.item_description}</p>
              <p>
                Prix :
                {" "}
                {currencyFormat(item.item_price)}
              </p>
              <div className="buttons">
                <Link to={`/articles/${item.item_id}`}>
                  <button type="button" className="ui inverted violet button"><i role="button" aria-label="item description" className="eye icon" /></button>
                </Link>
                {/*
                //TODO ajouter les liens
                */}
                <Link to="/">
                  <button type="button" className="ui inverted violet button"><i role="button" aria-label="update item" className="pencil alternate icon" /></button>
                </Link>
                <Link to="/">
                  <button type="button" className="ui inverted red button"><i role="button" aria-label="delete item" className="trash icon" /></button>
                </Link>
              </div>
            </aside>
          </article>
        </div>
      ))}
    </div>
  );
}

export default CreatorItems;
