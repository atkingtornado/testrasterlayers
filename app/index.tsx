import React, {Component, useEffect, useState, useMemo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null);

const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex:9999
  },
  button: {
    padding: 10,
    backgroundColor: "rgba(16, 16, 16, 0.9)",
    borderRadius: 5,
    borderColor: 'rgba(25, 118, 210, 0.2)',
    borderWidth: 1
  },
  icon: {
    width: 32 ,
    height: 32 ,
  },
})

const sat = "GOES16"
const band = "14"
const sector = "CONUS"

export default function Index() {
  const [times, setTimes] = useState([])

  const onPress = () => {
    if(times.length === 0){
       fetch('https://tiledata.satsquatch.com/tilesdata/GOES16_14_CONUS.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          setTimes(data.times.slice(-10))
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } else {
      setTimes([])
    }
   
    
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    > 
    <IconButton onPress={onPress}/>
      <MapLibreGL.MapView
        key={1}
        style={styles.map}
        logoEnabled={false}
        compassEnabled={true}
        attributionPosition={{top: 18, left: 18}}
        styleURL="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
      {times.map((timeURLStr, i) => {

        let isVisible = i === 0

        let layerID = sat + timeURLStr
        let sourceID = sat + timeURLStr + "source"

        let rasterSourceProps = {
          id: sourceID,
          tileUrlTemplates: [
            `https://tiledata.satsquatch.com/tilesdata/${sat+"_"+band}/${sector}/${timeURLStr}/{z}/{x}/{y}.png`,
          ],
          tileSize: 256,
          tms: true
        };

        console.log(rasterSourceProps)

        return(
          <MapLibreGL.RasterSource key={sourceID} {...rasterSourceProps}>
            <MapLibreGL.RasterLayer
              key={layerID}
              id={layerID}
              sourceID={sourceID}
              style={{rasterOpacity: isVisible ? 0.8 : 0.0, visibility: isVisible ? "visible" : "none", rasterFadeDuration: 0, rasterOpacityTransition: {duration: 0, delay: 0}}} //
            />
          </MapLibreGL.RasterSource>
        )
      })}

    </MapLibreGL.MapView>
  </View>
  );
}

type IconButtonProps = {
  onPress: () => void;
};

const IconButton = ({ onPress }: IconButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Image source={require('../assets/images/layers_hres.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}


export { IconButton }
