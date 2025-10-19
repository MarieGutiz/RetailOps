import { Box, Card, Flex, Avatar, Text, Link } from '@radix-ui/themes'
import { Button } from '../components/ui/Button'
import ProductForm from '@/components/forms/ProductForm'

const Home = () => {
  return (
    <>
	 <Box maxWidth="500px" m="40" >
	<Card variant="surface">
		<Flex gap="3" align="center">
			<Avatar
				size="3"
				src="src/assets/range.jpg"
				radius="full"
				fallback="T"
			/>
			<Box>
				<Text as="div" size="2" weight="bold">
					RetailOps
				</Text>
				<Text as="div" size="2" color="gray">
					Simulator
				</Text>
			</Box>
      <Box>
        <Text as="div" size="2" color="gray">
          Welcome to Inventory Simulator
		  <Link href="/login">
	       <Button className='color:black'>Login</Button>
	   </Link>
        </Text>
      </Box>
		</Flex>

	</Card>
	 <Card>
		 <Text>Check product store</Text>
		<ProductForm />
	 </Card>
</Box>

    </>
  )
}

export default Home