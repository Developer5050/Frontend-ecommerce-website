// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const ImageSlider = () => {
//   const sliderImages = [
//     "/images/slide1.png",
//     "/images/slide2.jpg",
//     "/images/slide3.jpg",
//   ];

//   const silderSettings = {
//     dots: true,
//     infinite: true,
//     autoplay: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplaySpeed: 3000,
//   };

//   return (
//     <div className="w-full">
//       <Slider {...silderSettings}>
//         {sliderImages.map((img, index) => (
//           <div key={index}>
//             <img
//               src={img}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-[100px] sm:h-[400px] md:h-[450px] object-cover"
//             />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default ImageSlider;
