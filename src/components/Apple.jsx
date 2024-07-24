import { useEffect } from "react";
import PropTypes from "prop-types";

const Apple = ({ position, ctx }) => {
  useEffect(() => {
    if (ctx) {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      const radius = 15; // blockSize / 2
      const x = position[0] * 30 + radius;
      const y = position[1] * 30 + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    }
  }, [position, ctx]);

  return null;
};

Apple.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  ctx: PropTypes.object,
};

export default Apple;
