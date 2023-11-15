cd backend

dotnet publish -c Release -o ../publish

cd ../frontend

bash -c "npm run-script build"

cd ..
cp Dockerfile publish