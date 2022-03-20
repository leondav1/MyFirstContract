const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Crypton', function() {
    let owner
    let acc1
    let acc2
    let acc3
    let crypton

    beforeEach(async function() {
        [owner, acc1, acc2, acc3, _] = await ethers.getSigners()
        const Crypton = await ethers.getContractFactory('Crypton', owner)
        // Ждём, пока транзакция будет отправлена
        crypton = await Crypton.deploy()
        // Ждём, пока транзакция будет выполнена
        await crypton.deployed()
    })

    it('Should be deployed', async () => {
        expect(crypton.address).to.be.properAddress
    })

    it('Should have 0 ether by default', async () => {
        const balance = await crypton.connect(owner).currentBalance()
        expect(balance).to.eq(0)
    })

    it('Should be possible to send funds', async () => {
        const sum = 100
        const tx = await crypton.connect(acc1).pay({ value: sum })

        await expect(() => tx)
            .to.changeEtherBalances([acc1, crypton], [-sum, sum]);
        await tx.wait()

        const newPayment = await crypton.connect(owner).getPayment(acc1.address, 0)
        expect(newPayment.amount).to.eq(sum)
        expect(newPayment.from).to.eq(acc1.address)
    })

    it('Should be possible to send funds from contract to any address', async () => {
        const sum = 100
        const sum1 = 50
        const tx = await crypton.connect(acc1).pay({ value: sum })

        await expect(() => tx)
            .to.changeEtherBalances([acc1, crypton], [-sum, sum]);
        await tx.wait()

        const tx1 = await crypton.connect(owner).transferTo(acc2.address, sum1)

        await expect(() => tx1)
            .to.changeEtherBalances([crypton, acc2], [-sum1, sum1]);
        await tx1.wait()

        expect((await crypton.addrBalance(acc2.address)).toString()).to.eq('10000000000000000000050')
        expect(await crypton.currentBalance()).to.eq(50)
    })

    it('Should be possible to withdraw all funds', async () => {
        const sum = 100
        const tx = await crypton.connect(acc1).pay({ value: sum })

        await expect(() => tx)
            .to.changeEtherBalances([acc1, crypton], [-sum, sum]);
        await tx.wait()

        const withdrawAll = await crypton.connect(owner).withdrawAll()
        await withdrawAll.wait()

        expect(await crypton.connect(owner).currentBalance()).to.eq(0)
    })

    it('Should be getAllAddresses function', async () => {
        const sum = 100
        const addresses = [acc1, acc1, acc2]
        let i = 0;
        const test = []
        for (i = 0; i < 3; i++) {
            const tx = await crypton.connect(addresses[i]).pay({ value: sum })

            await expect(() => tx)
                .to.changeEtherBalances([addresses[i], crypton], [-sum, sum]);
            await tx.wait()
            if(!(test.includes(addresses[i]))) {
                test.push(addresses[i])
            }
        }
        expect((await crypton.connect(owner).getAllAddresses()).length).to.eq(test.length)
    })
})