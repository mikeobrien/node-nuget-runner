using System;
using System.Linq;

namespace ConsoleApp
{
    class Program
    {
        static int Main(string[] args)
        {
            var command = args.Any() ? args[0] : "";
            if (command == "exception") throw new Exception(string.Join(" ", args.Skip(1).ToArray()));
            if (command == "return") 
            {
                Console.Write("Error " + args[1]);
                return int.Parse(args[1]);
            }
            if (command == "echo") Console.Write(string.Join(", ", args.Skip(1).ToArray()));
            return 0;
        }
    }
}