require('dotenv').config()

module.exports = async ({ network, getNamedAccounts, deployments }) => {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	await deploy('Voting', {
		from: deployer,
		args: [],
		log: true,
	});
};

module.exports.tags = ['Voting'];
