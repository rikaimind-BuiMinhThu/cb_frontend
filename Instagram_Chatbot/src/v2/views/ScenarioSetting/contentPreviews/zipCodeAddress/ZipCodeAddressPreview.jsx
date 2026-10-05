import React from 'react';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import '../../styles/contentPreviews/zipCodeAddress.css';

const ZipCodeAddressPreview = ({
  content,
  renderZipCodeAddressTitle,
  renderPostCode,
  renderPrefecture,
  renderMunicipality,
  renderAddressField,
  renderBuildingName,
}) => {
  const zipCodeAddress = content.zip_code_address;

  if (content.type !== 'zip_code_address') return null;

  return (
    <ContentPreviewShell className="ss-zip-code-address-preview">
      {renderZipCodeAddressTitle(zipCodeAddress)}
      {renderPostCode(zipCodeAddress)}
      {renderPrefecture(zipCodeAddress)}
      {renderMunicipality(zipCodeAddress)}
      {renderAddressField(zipCodeAddress)}
      {renderBuildingName(zipCodeAddress)}
    </ContentPreviewShell>
  );
};

export default ZipCodeAddressPreview;
