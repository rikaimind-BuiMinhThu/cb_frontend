import React from 'react';

const ZipCodeAddressPreview = ({
  content,
  message,
  indexContent,
  renderZipCodeAddressTitle,
  renderPostCode,
  renderPrefecture,
  renderMunicipality,
  renderAddressField,
  renderBuildingName,
}) => {
  const zipCodeAddress = content.zip_code_address;
  return (
    <>
      {
        content.type === 'zip_code_address' && (
          <div style={{ marginBottom: '10px' }}>
            {renderZipCodeAddressTitle(zipCodeAddress)}
            {renderPostCode(zipCodeAddress)}
            {renderPrefecture(zipCodeAddress)}
            {renderMunicipality(zipCodeAddress)}
            {renderAddressField(zipCodeAddress)}
            {renderBuildingName(zipCodeAddress)}
          </div>
        )
      }
    </>
  );
};

export default ZipCodeAddressPreview;
