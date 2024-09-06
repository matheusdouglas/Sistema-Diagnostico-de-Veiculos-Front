import React, { useState } from "react";
import axios from "axios";
import {
  ChakraProvider,
  Box,
  Heading,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Spinner,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import logo from "./assets/logo.jpeg"; // Atualize o caminho para a sua logo
import { Link } from "react-router-dom";

function Home() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [complaint, setComplaint] = useState("");
  const [dtcCode, setDtcCode] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [problemArea, setProblemArea] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // AbortController para cancelar a requisição
  const controller = new AbortController();
  const signal = controller.signal;

  const validateFields = () => {
    const newErrors = {};
    if (!complaint) newErrors.complaint = "Reclamação é obrigatória";
    if (!dtcCode) newErrors.dtcCode = "Código de Falha é obrigatório";
    if (!symptoms)
      newErrors.symptoms = "Sintomas Relacionados são obrigatórios";
    if (!problemArea) newErrors.problemArea = "Área do Problema é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const searchCode = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/search_code?code=${code}`,
        { signal }
      );
      setDescription(response.data.result);
      toast({
        title: "Código OBD2 encontrado!",
        description: response.data.result,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Requisição cancelada");
      } else {
        console.error("Erro ao buscar o código OBD2:", error);
        toast({
          title: "Erro",
          description: "Erro ao buscar o código OBD2.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setComplaint("");
    setDtcCode("");
    setSymptoms("");
    setProblemArea("");
    setDescription("");
    setDiagnosticResult(null);
    setErrors({});
  };

  const handleCancel = () => {
    controller.abort(); // Cancela a requisição
    setLoading(false);
  };

  const submitDiagnosis = async () => {
    if (!validateFields()) return;

    setLoading(true);
    const diagnosisData = {
      customer_complaint: complaint,
      method_choice: 1, // Ajuste conforme necessário
      dtc_code: dtcCode,
      related_symptoms: symptoms,
      problem_area: problemArea,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/diagnose",
        diagnosisData
      );
      setDiagnosticResult(response.data);
      toast({
        title: "Diagnóstico Enviado!",
        description: "O diagnóstico foi enviado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erro ao enviar o diagnóstico:", error);
      toast({
        title: "Erro",
        description: "Erro ao enviar o diagnóstico.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box p={6} position="relative">
        <HStack>
          <Image
            src={logo}
            alt="Logo"
            position="absolute"
            top={4}
            right={1755}
            boxSize="50px" // Ajuste o tamanho conforme necessário
          />
          <Heading mb={4} mr={1626} color={"green"}>
            Chat
          </Heading>

          <Box  >
            <Link to="/OBD2List">
              <Button colorScheme="yellow" color={'white'}>Lista de Codigos</Button>
            </Link>
          </Box>
        </HStack>

        <VStack spacing={6} align="stretch">
          {/* Seção para buscar código OBD2 */}
          <Box p={6} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
            <Heading as="h2" size="md" mb={4}>
              Buscar Código OBD2
            </Heading>
            <HStack>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Digite o código OBD2"
                size="md"
              />
              <Button
                leftIcon={<SearchIcon />}
                colorScheme="blue"
                onClick={searchCode}
                isDisabled={loading}
              >
                {loading ? <Spinner speed="0.65s" /> : "Buscar"}
              </Button>
              <Button
                leftIcon={<CloseIcon />}
                colorScheme="gray"
                onClick={handleCancel}
                isDisabled={!loading}
              >
                Cancelar
              </Button>
            </HStack>
            {description && (
              <Box
                mt={4}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontWeight="bold">Descrição:</Text>
                <Text>{description}</Text>
              </Box>
            )}
          </Box>

          {/* Seção para enviar diagnóstico */}
          <Box p={6} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
            <Heading as="h2" size="md" mb={4}>
              Enviar Diagnóstico
            </Heading>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.complaint}>
                <FormLabel>Reclamação do Cliente</FormLabel>
                <Input
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="Reclamação do Cliente"
                  size="md"
                />
                <FormErrorMessage bg="red.100" p={2} borderRadius="md">
                  {errors.complaint}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.dtcCode}>
                <FormLabel>Código de Falha OBD2</FormLabel>
                <Input
                  value={dtcCode}
                  onChange={(e) => setDtcCode(e.target.value)}
                  placeholder="Código de Falha OBD2"
                  size="md"
                />
                <FormErrorMessage bg="red.100" p={2} borderRadius="md">
                  {errors.dtcCode}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.symptoms}>
                <FormLabel>Sintomas Relacionados</FormLabel>
                <Input
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Sintomas Relacionados"
                  size="md"
                />
                <FormErrorMessage bg="red.100" p={2} borderRadius="md">
                  {errors.symptoms}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.problemArea}>
                <FormLabel>Área do Problema</FormLabel>
                <Input
                  value={problemArea}
                  onChange={(e) => setProblemArea(e.target.value)}
                  placeholder="Área do Problema"
                  size="md"
                />
                <FormErrorMessage bg="red.100" p={2} borderRadius="md">
                  {errors.problemArea}
                </FormErrorMessage>
              </FormControl>
              <HStack mr={1510} spacing={3}>
                <Button
                  colorScheme="green"
                  onClick={submitDiagnosis}
                  isDisabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Enviar Diagnóstico"}
                </Button>
                <Button
                  leftIcon={<CloseIcon />}
                  colorScheme="red"
                  onClick={onOpen}
                >
                  Limpar
                </Button>
              </HStack>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Confirmar Limpeza</ModalHeader>
                  <ModalBody>
                    Tem certeza que deseja limpar todos os campos?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        handleClearForm();
                        onClose();
                      }}
                    >
                      Sim, Limpar
                    </Button>
                    <Button onClick={onClose} spacing={4}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {diagnosticResult && (
                <Box
                  mt={4}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="green.50"
                  position="relative"
                >
                  <Button
                    position="absolute"
                    top="4px"
                    right="4px"
                    size="xs"
                    colorScheme="red"
                    onClick={() => setDiagnosticResult(null)}
                  >
                    Fechar
                  </Button>
                  <Text fontWeight="bold">Resultado do Diagnóstico:</Text>
                  <Text>{`Método de Diagnóstico: ${diagnosticResult.diagnosis["Método de Diagnóstico"]}`}</Text>
                  <Text>{`Sugestão: ${diagnosticResult.suggestion}`}</Text>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default Home;
