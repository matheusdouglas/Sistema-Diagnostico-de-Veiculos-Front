import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

function OBD2List() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await axios.get('https://sistema-diagnostico-de-veiculos-backend.onrender.com/codes');
        setCodes(response.data);
      } catch (error) {
        console.error('Erro ao buscar códigos OBD2:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao buscar códigos OBD2.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [toast]);

  return (
    <Box p={6}>
      <Link to="/">
        <Button leftIcon={<ArrowBackIcon />} colorScheme="teal" mb={4}>
          Voltar
        </Button>
      </Link>
      <Heading mb={4}>Lista de Códigos OBD2</Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <VStack spacing={4}>
          {codes.length === 0 ? (
            <Text>Nenhum código encontrado</Text>
          ) : (
            codes.map((code) => (
              <Box
                key={code.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
                width="100%"
              >
                <Text fontWeight="bold">Código:</Text>
                <Text>{code.code}</Text>
                <Text fontWeight="bold">Descrição:</Text>
                <Text>{code.description}</Text>
              </Box>
            ))
          )}
        </VStack>
      )}
    </Box>
  );
}

export default OBD2List;
