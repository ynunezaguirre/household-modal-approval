import React, { useEffect, useRef, useState } from 'react';
import { Inputcontainer } from './styled';
import { loadScript } from '../../utils';
import { InputStyled, LabelInput } from '../Input/styled';

let autoComplete: any = null;
const GoogleAutoComplete = (props: Props) => {
  const { googleKey, country, callback, placeholder, label } = props;
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  // const [autoComplete, setAutoComplete] = useState<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [addressComponent, setAddressComponent] = useState<Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>>([]);

  useEffect(() => {
    if (googleKey && !scriptLoaded) {
      console.log('key', googleKey);
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places`,
        () => handleScriptLoad(autoCompleteRef)
      );
    }
  }, [googleKey]);

  useEffect(() => {
    if (addressComponent.length) {
      const postalCode = addressComponent.find(comp => {
        if (comp.types.find(type => type === 'postal_code')) {
          return true;
        }
        return false;
      });
      const state = addressComponent.find(comp => {
        if (comp.types.find(type => type === 'administrative_area_level_1')) {
          return true;
        }
        return false;
      });
      const city = addressComponent.find(comp => {
        if (comp.types.find(type => type === 'locality')) {
          return true;
        }
        return false;
      });
      const neighborhood = addressComponent.find(comp => {
        if (comp.types.find(type => type === 'neighborhood')) {
          return true;
        }
        return false;
      });
      if (callback) {
        const stateFix = state?.short_name.toUpperCase().replace(/\./g, '').trim() || '';
        callback({
          postalCode: postalCode?.short_name || '',
          state: stateFix,
          city: city?.short_name || '',
          neighborhood: neighborhood?.short_name || '',
          fullAddress: query
        });
      }
    }
  }, [addressComponent, query])
  
  
  
  const handleScriptLoad = (autoCompleteRef: React.MutableRefObject<any> ) => {
    setScriptLoaded(true);
    const { maps } = (window as any).google;
    autoComplete = new maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        componentRestrictions: { country: country || 'mx' }, 
        fields: ["address_components"],
      }
    );
    autoComplete.setFields(["address_components", "formatted_address"]);
    autoComplete.addListener("place_changed", () =>
      handlePlaceSelect(),
    );
    // setAutoComplete(autoCompletObj);
  }
  
  async function handlePlaceSelect() {
    const addressObject = autoComplete.getPlace();
    setAddressComponent(addressObject.address_components);
    console.log((autoCompleteRef.current as any).value);
    setQuery((autoCompleteRef.current as any).value);
  }

  return (
    <Inputcontainer>
      {!!label && (
        <LabelInput sizeInput={'small'}>{label}</LabelInput>
      )}
      <InputStyled
        sizeInput={'small'}
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
      />
    </Inputcontainer>
  )
};

type Props = {
  googleKey: string;
  country?: string;
  placeholder: string;
  label?: string;
  callback?: (p: {
    postalCode: string;
    state: string;
    city: string;
    neighborhood: string;
    fullAddress: string;
  }) => void;
};

export default GoogleAutoComplete;