// React
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

// Constants
import { ETHEREUM_CLIENT, projectId, theme, WAGMI_CLIENT } from './data/constants';

// Components
import Header from './components/Navigation/Header/Header';
import Home from './pages/Home/Home';

// Web3Modal
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';

// Styles
import './App.css';


/**
 * @description Renders the whole app.
 * @author Jesús Sánchez Fernández | WWW.JSANCHEZFDZ.ES
 * @version 1.0.0
 */
function App() {
	return (
		<>
			<ChakraProvider theme={theme}>
				<WagmiConfig client={WAGMI_CLIENT}>
					<Header />
					<Home />
				</WagmiConfig>
			</ChakraProvider>
			<Web3Modal projectId={projectId} ethereumClient={ETHEREUM_CLIENT} />
		</>
	);
}

export default App;
