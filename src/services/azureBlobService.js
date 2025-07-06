// Servicio para subir imágenes a Azure Blob Storage
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage connection string not found in environment variables');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

/**
 * Sube una imagen a un contenedor específico de Azure Blob Storage
 * @param {Buffer} fileBuffer - Buffer de la imagen
 * @param {string} originalName - Nombre original del archivo
 * @param {string} mimetype - Tipo MIME
 * @param {string} containerName - Nombre del contenedor
 * @returns {string} URL pública de la imagen
 */
async function uploadImageToAzure(fileBuffer, originalName, mimetype, containerName = 'imagenes-productos') {
  const extension = path.extname(originalName);
  const blobName = `${uuidv4()}${extension}`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimetype }
  });

  if (uploadBlobResponse.errorCode) {
    throw new Error('Error uploading image to Azure Blob Storage');
  }

  // URL pública
  const publicUrl = blockBlobClient.url;
  return publicUrl;
}

module.exports = {
  uploadImageToAzure
};
