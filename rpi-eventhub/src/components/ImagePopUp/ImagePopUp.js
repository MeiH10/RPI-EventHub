import React from 'react';

/* const HoverrImage = ({ imageSrc }) => {
  const [hover, setHover] = useState(false);

  return (
      <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
          {hover && <img src={imageSrc} alt="Hover Image" />}
      </div>
  );
}
 */

class HoverImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    mouseOver = () => {
        this.setState({ hover: true });
    }

    mouseOut = () => {
        this.setState({ hover: false });
    }

    render() {
        const { imageSrc } = this.props;
        return (
            <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                {this.state.hover ? (<img src={imageSrc} alt="Hover Image" />) : null}
            </div>
        );
    }
}

export default HoverImage;