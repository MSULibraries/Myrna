import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';

const DescriptionContainer = styled.div`padding: 10px;`;

const ProductImage = styled.img`
  min-height: 250px;
  filter: ${({ isAvailible }) => {
    if (isAvailible === false) {
      return 'grayscale(100%)';
    }
    return 'grayscale(0%)';
  }};
`;

const CardMediaContainer = styled(CardMedia)`max-width: 320px;`;

const PageDetailLink = styled.a`text-decoration: none;`;

export const ProductCard = ({
  _id,
  addProductToCart,
  category,
  isAuthed = false,
  name,
  oldId,
  description,
  isAvailible = false,
  imgSrc,
  shortDescription,
}) => (
  <Paper zDepth={3}>
    <Card>
      <PageDetailLink>
        {!isAvailible ? (
          <CardMediaContainer overlay={<CardTitle subtitle="Out Of Stock" />}>
            <ProductImage
              disabled={!isAvailible}
              src={`images/clothing/${category.toLowerCase()}/${oldId}/small/${JSON.parse(description).picture_1}`}
              alt={`images/clothing/${category}/${oldId}/small/${JSON.parse(description)
                .picture_1}`}
            />
          </CardMediaContainer>
        ) : (
          <CardMediaContainer>
            <ProductImage
              disabled={!isAvailible}
              src={`images/clothing/${category.toLowerCase()}/${oldId}/small/${JSON.parse(description).picture_1}`}
              alt={`images/clothing/${category}/${oldId}/small/${JSON.parse(description)
                .picture_1}`}
            />
          </CardMediaContainer>
        )}
      </PageDetailLink>

      <DescriptionContainer>
        <PageDetailLink href="#">
          <CardText dangerouslySetInnerHTML={{ __html: shortDescription }} />
        </PageDetailLink>
      </DescriptionContainer>
      <CardActions>
        {isAuthed && (
          <FlatButton
            disabled={!isAvailible}
            label="Add To Cart"
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
  name: PropTypes.string,
  oldId: PropTypes.number,
  shortDescription: PropTypes.string,
};

export default ProductCard;
