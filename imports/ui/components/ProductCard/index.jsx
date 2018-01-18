import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const ProductCard = ({
  _id,
  addProductToCart,
  category,
  isAuthed = false,
  name,
  oldId,
  description,
  itemInCart,
  isAvailible = false,
  imgSrc,
  shortDescription,
}) => (
    <Paper zDepth={3}>
      <Card>
        <DetailLink to={`/products/details/${_id}`}>
          {!isAvailible ? (
            <CardMediaContainer overlay={<CardTitle subtitle="Out Of Stock" />}>
              <ProductImage
                disabled={!isAvailible}
                src={`images/clothing/${category.toLowerCase()}/${oldId}/small/${
                  JSON.parse(description).picture_1
                  }`}
                alt={`images/clothing/${category}/${oldId}/small/${
                  JSON.parse(description).picture_1
                  }`}
              />
            </CardMediaContainer>
          ) : (
              <CardMediaContainer>
                <ProductImage
                  disabled={!isAvailible}
                  src={`images/clothing/${category.toLowerCase()}/${oldId}/small/${
                    JSON.parse(description).picture_1
                    }`}
                  alt={`images/clothing/${category}/${oldId}/small/${
                    JSON.parse(description).picture_1
                    }`}
                />
              </CardMediaContainer>
            )}
        </DetailLink>

        <DescriptionContainer>
          <DetailLink to={`/products/details/${_id}`}>
            <CardText dangerouslySetInnerHTML={{ __html: shortDescription }} />
          </DetailLink>
        </DescriptionContainer>
        <CardActions>
          {isAuthed && (
            <FlatButton
              disabled={!isAvailible || itemInCart}
              label={itemInCart ? "In Cart" : "Add To Cart"}
              onClick={() => addProductToCart(_id)}
            />
          )}
        </CardActions>
      </Card>
    </Paper>
  );

ProductCard.propTypes = {
  _id: PropTypes.string,
  addProductToCart: PropTypes.func,
  category: PropTypes.string,
  description: PropTypes.string,
  isAvailible: PropTypes.bool,
  imgSrc: PropTypes.string,
  isAuthed: PropTypes.bool,
  itemInCart: PropTypes.bool,
  name: PropTypes.string,
  oldId: PropTypes.number,
  shortDescription: PropTypes.string,
};

const DescriptionContainer = styled.div`
  padding: 10px;
`;

const ProductImage = styled.img`
  min-height: 250px;
  filter: ${({ isAvailible }) => {
    if (isAvailible === false) {
      return 'grayscale(100%)';
    }
    return 'grayscale(0%)';
  }};
`;

const CardMediaContainer = styled(CardMedia) `
  max-width: 320px;
`;

const DetailLink = styled(Link) `
  text-decoration: none;
`;

export default ProductCard;