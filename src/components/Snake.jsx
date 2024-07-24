import { useEffect } from "react";
import PropTypes from "prop-types";

const Snake = ({ body, ctx }) => {
  useEffect(() => {
    if (ctx) {
      ctx.save();
      body.forEach((block) => {
        const x = block[0] * 30;
        const y = block[1] * 30;
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(x, y, 30, 30);
      });
      ctx.restore();
    }
  }, [body, ctx]);

  return null;
};

Snake.propTypes = {
  body: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  ctx: PropTypes.object,
};

export default Snake;
