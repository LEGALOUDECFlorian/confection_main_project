/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable linebreak-style */
import { useState, useEffect } from "react";
import {
  Form, Input, TextArea, Button, Checkbox, Dropdown, Image, Segment,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import axios from "axios";

function Formaddarticle() {
  const workshopId = parseInt(localStorage.getItem("workshopId"), 10);
  const [articleData, setArticleData] = useState({
    name: "test",
    description: "test",
    picture: "",
    price: 29,
    material: "coton",
    customizable: false,
    workshop_id: workshopId,
    category_id: 1,
    subcategory_id: 2,
    status_id: 1,
  });

  const [categoriesWithSubcategories, setCategoriesWithSubcategories] = useState([]);

  useEffect(() => {
    const fetchDataCategoriesWithSubcategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories/sous-categories`);
        setCategoriesWithSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching categories with subcategories:", error);
      }
    };

    fetchDataCategoriesWithSubcategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData({ ...articleData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setArticleData({ ...articleData, customizable: !articleData.customizable });
  };

  const handlePictureChange = (e) => {
    setArticleData({ ...articleData, picture: e.target.files[0] });
  };

  const handleCategoryChange = (e, { value }) => {
    setArticleData({ ...articleData, category_id: value, subcategory_id: 1 });
  };

  const handleSubcategoryChange = (e, { value }) => {
    setArticleData({ ...articleData, subcategory_id: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cloudinaryData = new FormData();
      cloudinaryData.append("picture", articleData.picture);
      const cloudinaryRes = await axios.post("http://localhost:3000/upload", cloudinaryData);
      const imageUrl = cloudinaryRes.data.secure_url;
      const newArticleData = { ...articleData, picture: imageUrl };

      await axios.post(`${import.meta.env.VITE_API_URL}/articles`, newArticleData);
      toast.success("Article ajouté avec succès !");
      setArticleData({
        name: "test",
        description: "test",
        picture: "",
        price: 0,
        material: "test",
        customizable: false,
        workshop_id: workshopId,
        category_id: 2,
        subcategory_id: 2,
        status_id: 2,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      toast.error("Erreur lors de l'ajout de l'article");
    }
  };

  const uniqueCategories = [...new Set(categoriesWithSubcategories
    .map((category) => category.category_id))];

  return (
    <div className="ui grid centered">
      <div className="eight wide column">
        <Segment>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label htmlFor="name">
                Nom de l'article
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={articleData.name}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom de l'article"
                  required
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor="description">
                Description
                <TextArea
                  id="description"
                  name="description"
                  value={articleData.description}
                  onChange={handleInputChange}
                  placeholder="Entrez la description de l'article"
                  required
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor="item Picture">
                Image
                <Input
                  id="item Picture"
                  type="file"
                  name="item Picture"
                  onChange={handlePictureChange}
                  accept="image/*"
                  required
                />
              </label>
              {articleData.picture && (
                <div className="image-preview">
                  <Image src={URL.createObjectURL(articleData.picture)} size="small" />
                </div>
              )}
            </Form.Field>
            <Form.Field>
              <label htmlFor="price">
                Prix
                <Input
                  id="price"
                  type="number"
                  name="price"
                  value={articleData.price}
                  onChange={handleInputChange}
                  placeholder="Entrez le prix de l'article"
                  required
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor="item Picture">
                Matière
                <Input
                  id="item Picture"
                  type="text"
                  name="material"
                  value={articleData.material}
                  onChange={handleInputChange}
                  placeholder="Entrez la matière de fabrication de l'article"
                  required
                />
              </label>
            </Form.Field>
            <Form.Field>
              <Checkbox
                label="Personnalisable"
                checked={articleData.customizable}
                onChange={handleCheckboxChange}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="Select Category">
                Catégorie
                <Dropdown
                  id="SelectCategory"
                  placeholder="Sélectionner une catégorie"
                  fluid
                  selection
                  options={uniqueCategories.map((categoryId) => {
                    const category = categoriesWithSubcategories
                      .find((cat) => cat.category_id === categoryId);
                    return {
                      key: categoryId,
                      text: category.category_name,
                      value: categoryId,
                    };
                  })}
                  onChange={handleCategoryChange}
                  value={articleData.category_id}
                />
              </label>
            </Form.Field>
            <Form.Field>
              <label htmlFor="Select Subcategory">Sous-catégorie</label>
              <Dropdown
                id="SelectSubcategory"
                placeholder="Sélectionner une sous-catégorie"
                fluid
                selection
                // options={categoriesWithSubcategories
                //   ? categoriesWithSubcategories
                //       .filter((category) => category.category_id === articleData.category_id)
                //       .flatMap((category) => category.subcategories.map((subcategory) => ({
                //         key: subcategory.subcategory_id,
                //         text: subcategory.subcategory_name,
                //         value: subcategory.subcategory_id,
                //       })))
                //   : []
                // }
                onChange={handleSubcategoryChange}
                value={articleData.subcategory_id}
              />
            </Form.Field>
            <Button type="submit" style={{ color: "white" }}>Ajouter l'article</Button>
          </Form>
        </Segment>
      </div>
    </div>
  );
}

export default Formaddarticle;
