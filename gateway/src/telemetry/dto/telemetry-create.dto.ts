import { IsIn, IsIP, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateTelemetryDto {
    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(["GET", "PUT", "PATCH", "POST", "DELETE"])
    method: string

    @IsNotEmpty()
    @IsString()
    @IsIP()
    ip: string

    @IsNotEmpty()
    @IsNumber()
    @Min(100)
    @Max(599)
    statusCode: number

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    responseTimeMs: number
}