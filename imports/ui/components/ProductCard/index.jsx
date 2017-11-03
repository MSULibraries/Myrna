import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import styled from 'styled-components';

const DescriptionContainer = styled.div`padding: 10px;`;

const ProductImage = styled.img`
  min-height: 250px;
  filter: ${(props) => {
    if (props.disabled) {
      return 'grayscale(100%)';
    }
    return 'grayscale(0%)';
  }};
`;

const CardMediaContainer = styled(CardMedia)`max-width: 320px;`;

const PageDetailLink = styled.a`text-decoration: none;`;

const ProductCard = ({
  _id,
  addProductToCart,
  category,
  isAuthed = false,
  name,
  oldId,
  description,
  disabled = false,
  imgSrc,
  shortDescription,
}) => (
  <Paper zDepth={3}>
    <Card>
      <PageDetailLink>
        {disabled ? (
          <CardMediaContainer overlay={<CardTitle subtitle="Out Of Stock" />}>
            <ProductImage disabled={disabled} src={imgSrc} alt={shortDescription} />
          </CardMediaContainer>
        ) : (
          <CardMediaContainer>
            <ProductImage
              disabled={disabled}
              src={`images/clothing/${category}/${oldId}/small/${JSON.parse(description)
                .picture_1}`}
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
        {isAuthed && <FlatButton label="Add To Cart" onClick={() => addProductToCart(_id)} />}
      </CardActions>
    </Card>
  </Paper>
);

ProductCard.propTypes = {
  _id: PropTypes.object,
  addProductToCart: PropTypes.func,
  category: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.string,
  imgSrc: PropTypes.string,
  isAuthed: PropTypes.bool,
  name: PropTypes.string,
  oldId: PropTypes.number,
  shortDescription: PropTypes.string,
};

export default ProductCard;
