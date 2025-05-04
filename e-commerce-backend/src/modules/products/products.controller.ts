import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('featured') featured?: boolean,
    @Query('categoryId') categoryId?: number,
    @Query('vendorId') vendorId?: number,
  ) {
    return this.productsService.findAll({ featured, categoryId, vendorId });
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.productsService.search(query);
  }

  @Get('featured')
  getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }

  @Get('category/:categoryId')
  getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.getProductsByCategory(+categoryId);
  }

  @Get('vendor/:vendorId')
  getProductsByVendor(@Param('vendorId') vendorId: string) {
    return this.productsService.getProductsByVendor(+vendorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles()
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
