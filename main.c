#include <stdio.h>
#include <stdlib.h>

char* get_content (path) {
  FILE *fp;

  fp = fopen(argv[1], "r");
  if (fp == NULL) {
    fprintf(stderr, "%s not found.\n", path);
    exit(1);
  }

  fseek(fp, 0, SEEK_END); // 指针移到文件末位  
  long lSize = ftell(fp);
  rewind(fp);

  char* buffer;
  // allocate memory to contain the whole file: 为整个文件分配内存缓冲区  
  buffer = (char*) malloc(sizeof(char) * lSize); // 分配缓冲区，按前面的 lSize
  size_t result = fread(buffer, 1, lSize, fp); // 返回值是读取的内容数量
  // 关闭文件
  fclose(fp);
  return buffer;
}

struct token
{
  char opera;
  int left;
  int right;
};

token* get_token(char* buff) {
  return;
};

int main(int argc, char **argv)
{
  // argc 参数个数
  if (argc != 2) {
    fprintf(stderr, "usage:%s filename\n", argv[0]);
    exit(1);
  }

  char* buffer = get_content(argv[1]);

  printf("%s\n", buffer);
  return 0;
}

